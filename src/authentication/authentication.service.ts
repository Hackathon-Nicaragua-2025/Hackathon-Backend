import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto, CreateUserDto } from './dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User } from '../common/entities/app/user.entity';
import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '../common/exceptions/custom-exceptions';
import { ConfigService } from '@nestjs/config';
import { PasswordHasherService } from '../common/services/password-hasher.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { Role } from '../common/entities/app/role.entity';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordHasher: PasswordHasherService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: ['userId', 'passwordHash', 'isActive', 'nombre', 'email'],
        relations: ['roles', 'roles.permissions'], // Fetch roles and their permissions
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.passwordHasher.comparePasswords(password, user.passwordHash || '');

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Extract permissions and roles
      const permissions = this.getUserPermissions(user.roles);
      const roles = this.getUserRoles(user.roles);

      const userResponse = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      const refreshToken = this.getRefreshToken({ userId: user.userId });
      const token = this.getJwtToken({ userId: user.userId });

      return {
        ...userResponse,
        token,
        refreshToken,
        permissions,
        roles, // Include roles in the response
        // Incluir propiedades getter explícitamente
        id: userResponse.userId,
        firstName: userResponse.nombre.split(' ')[0] || userResponse.nombre,
        lastName: userResponse.nombre.split(' ').slice(1).join(' ') || '',
        age: 0,
      };
    } catch (error) {
      this.logger.error(`Error during login for email ${loginUserDto.email}:`, error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Fetch the user based on the payload from the token
      const user = await this.userRepository.findOne({
        where: { userId: payload.userId },
        relations: ['refreshTokens'],
      });

      if (!user || !user.refreshTokens || user.refreshTokens.length === 0) {
        throw new UnauthorizedException('Invalid user for refresh token');
      }

      // Fetch the stored token
      const storedToken = user.refreshTokens[0];

      // Check if the token is valid and not expired
      if (!storedToken || new Date(storedToken.expiresAt).getTime() < Date.now()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Return a new JWT token
      return {
        token: this.getJwtToken({ userId: user.userId }),
      };
    } catch (error) {
      // Improved error handling for JWT-specific errors
      if (error instanceof Error) {
        switch (error.name) {
          case 'TokenExpiredError':
            this.logger.warn('Refresh token expired');
            throw new UnauthorizedException('Refresh token expired');
          case 'JsonWebTokenError':
            this.logger.warn('Invalid refresh token');
            throw new UnauthorizedException('Invalid refresh token');
          default:
            this.logger.error('Error during refresh token:', error);
            throw new InternalServerErrorException('An unexpected error occurred during token refresh.');
        }
      }

      // Handle unknown errors
      this.logger.error('Unknown error during refresh token:', error);
      throw new InternalServerErrorException('An unexpected error occurred during token refresh.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userRepository.manager.transaction(async (manager) => {
      const { password, roles, ...userData } = createUserDto;

      // Check if user already exists
      const existingUser = await manager.findOne(User, {
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      // Hash the password
      const hashedPassword = await this.passwordHasher.hashPassword(password);

      // Fetch roles based on the role names provided in createUserDto
      const assignedRoles = await manager.find(Role, {
        where: (roles || []).map((roleName) => ({ name: roleName })),
      });

      if (assignedRoles.length !== (roles || []).length) {
        throw new BadRequestException('One or more roles are invalid');
      }

             // Create the user entity and assign the roles
       const user = manager.create(User, {
         ...userData,
         passwordHash: hashedPassword,
         roles: assignedRoles, // Assign the actual Role entities here
       });

      // Save the user
      const savedUser = await manager.save(user);

      // Return the user response
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

    return Array.from(permissionsSet); // Convert Set to Array
  }

  private getUserRoles(roles: Role[]): RoleDto[] {
    return roles.map((role) => {
      return {
        id: role.roleId,
        name: role.name,
      };
    });
  }

  private getJwtToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN');
    return this.jwtService.sign(payload, { expiresIn });
  }

  private getRefreshToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
    return this.jwtService.sign(payload, { expiresIn });
  }
}
