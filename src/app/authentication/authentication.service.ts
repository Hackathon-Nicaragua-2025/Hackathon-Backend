import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto, CreateUserDto } from '../../app/authentication/dto';
import { UserResponseDto } from '../../app/authentication/dto/user-response.dto';
import { JwtPayload } from '../../app/authentication/interface/jwt-payload.interface';
import { User } from '../../common/entities/app/user.entity';
import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '../../common/exceptions/custom-exceptions';
import { ConfigService } from '@nestjs/config';
import { PasswordHasherService } from '../../common/services/password-hasher.service';
import { LoginResponseDto } from '../../app/authentication/dto/login-response.dto';
import { TokenResponseDto } from '../../app/authentication/dto/token-response.dto';
import { Role } from '../../common/entities/app/role.entity';
import { RoleDto } from '../../app/authentication/dto/role.dto';
import { PasswordRecoveryService } from '../../common/services/password-recovery.service';
import { RefreshToken } from '../../common/entities/app/refresh-token.entity';
import { LoginAudit } from '../../common/entities/app/login-audit.entity';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordHasher: PasswordHasherService,
    private readonly passwordRecoveryService: PasswordRecoveryService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(LoginAudit)
    private readonly loginAuditRepository: Repository<LoginAudit>,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { emailNormalized: email.toLowerCase() },
        select: ['userId', 'passwordHash', 'isActive', 'nombre', 'email', 'failedLoginCount', 'lockoutUntil'],
        relations: ['roles', 'roles.permissions'],
      });

      if (!user || !user.isActive) {
        await this.logLoginAttempt(null, 'login_failed', 'Invalid credentials');
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar si el usuario está bloqueado
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        await this.logLoginAttempt(user.userId, 'login_failed', 'Account locked');
        throw new UnauthorizedException('Cuenta bloqueada temporalmente');
      }

      const isPasswordValid = await this.passwordHasher.comparePasswords(password, user.passwordHash);

      if (!isPasswordValid) {
        // Incrementar contador de intentos fallidos
        await this.incrementFailedLoginCount(user.userId);
        await this.logLoginAttempt(user.userId, 'login_failed', 'Invalid password');
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Resetear contador de intentos fallidos
      await this.resetFailedLoginCount(user.userId);

      // Actualizar último login
      await this.updateLastLogin(user.userId);

      // Extraer permisos y roles
      const permissions = this.getUserPermissions(user.roles);
      const roles = this.getUserRoles(user.roles);

      const userResponse = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      const refreshToken = await this.createRefreshToken(user.userId);
      const token = this.getJwtToken({ userId: user.userId });

      await this.logLoginAttempt(user.userId, 'login_success', 'Login successful');

      return {
        ...userResponse,
        token,
        refreshToken: refreshToken.tokenHash,
        permissions,
        roles,
      };
    } catch (error) {
      this.logger.error(`Error durante login para email ${loginUserDto.email}:`, error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Buscar el refresh token en la base de datos
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { tokenHash: refreshToken },
        relations: ['user'],
      });

      if (!storedToken || !storedToken.user) {
        throw new UnauthorizedException('Token de renovación inválido');
      }

      // Verificar si el token ha expirado o ha sido revocado
      if (storedToken.expiresAt < new Date() || storedToken.revokedAt) {
        throw new UnauthorizedException('Token de renovación expirado o revocado');
      }

      // Crear nuevo JWT token
      const newToken = this.getJwtToken({ userId: storedToken.user.userId });

      await this.logLoginAttempt(storedToken.user.userId, 'refresh', 'Token refreshed');

      return {
        token: newToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          case 'TokenExpiredError':
            this.logger.warn('Refresh token expirado');
            throw new UnauthorizedException('Token de renovación expirado');
          case 'JsonWebTokenError':
            this.logger.warn('Refresh token inválido');
            throw new UnauthorizedException('Token de renovación inválido');
          default:
            this.logger.error('Error durante renovación de token:', error);
            throw new InternalServerErrorException('Error inesperado durante la renovación del token.');
        }
      }
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userRepository.manager.transaction(async (manager) => {
      const { password, roles, ...userData } = createUserDto;

      // Verificar si el usuario ya existe
      const existingUser = await manager.findOne(User, {
        where: { emailNormalized: userData.email.toLowerCase() },
      });

      if (existingUser) {
        throw new BadRequestException('El usuario ya existe');
      }

      // Hashear la contraseña
      const hashedPassword = await this.passwordHasher.hashPassword(password);

      // Buscar roles basados en los nombres proporcionados
      const assignedRoles = await manager.find(Role, {
        where: roles.map((roleName) => ({ name: roleName })),
      });

      if (assignedRoles.length !== roles.length) {
        throw new BadRequestException('Uno o más roles son inválidos');
      }

      // Crear la entidad de usuario y asignar los roles
      const user = manager.create(User, {
        ...userData,
        passwordHash: hashedPassword,
        roles: assignedRoles,
        emailNormalized: userData.email.toLowerCase(),
      });

      // Guardar el usuario
      const savedUser = await manager.save(user);

      // Retornar la respuesta del usuario
      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    });
  }

  private getUserPermissions(roles: Role[]): string[] {
    const permissionsSet = new Set<string>();

    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionsSet.add(permission.name);
      });
    });

    return Array.from(permissionsSet);
  }

  private getUserRoles(roles: Role[]): RoleDto[] {
    return roles.map((role) => {
      return {
        roleId: role.roleId,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      };
    });
  }

  async sendPasswordRecoveryCode(email: string): Promise<void> {
    return this.passwordRecoveryService.sendPasswordRecoveryCode(email);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    return this.passwordRecoveryService.updatePassword(email, newPassword);
  }

  private async createRefreshToken(userId: string): Promise<RefreshToken> {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d';
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días por defecto

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      tokenHash: this.generateTokenHash(),
      expiresAt,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  private generateTokenHash(): string {
    // Generar un hash único para el refresh token
    return require('crypto').randomBytes(64).toString('hex');
  }

  private async incrementFailedLoginCount(userId: string): Promise<void> {
    await this.userRepository.increment({ userId }, 'failedLoginCount', 1);
    
    // Verificar si debe bloquear la cuenta (después de 5 intentos)
    const user = await this.userRepository.findOne({ where: { userId } });
    if (user && user.failedLoginCount >= 5) {
      const lockoutUntil = new Date();
      lockoutUntil.setMinutes(lockoutUntil.getMinutes() + 30); // Bloquear por 30 minutos
      await this.userRepository.update(userId, { lockoutUntil });
    }
  }

  private async resetFailedLoginCount(userId: string): Promise<void> {
    await this.userRepository.update(userId, { 
      failedLoginCount: 0, 
      lockoutUntil: null 
    });
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }

  private async logLoginAttempt(userId: string | null, event: string, details: string): Promise<void> {
    const loginAudit = this.loginAuditRepository.create({
      userId,
      event,
      ipAddress: '127.0.0.1', // Esto debería venir del request
      userAgent: 'Unknown', // Esto debería venir del request
    });

    await this.loginAuditRepository.save(loginAudit);
  }

  private getJwtToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '3h';
    return this.jwtService.sign(payload, { expiresIn });
  }
}
