import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/app/user.entity';
import { VerificationToken } from '../entities/app/verification-token.entity';
import { PasswordHasherService } from './password-hasher.service';
import { BadRequestException } from '../exceptions/custom-exceptions';

@Injectable()
export class PasswordRecoveryService {
  private readonly logger = new Logger(PasswordRecoveryService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async sendPasswordRecoveryCode(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailNormalized: email.toLowerCase() },
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      this.logger.log(`Password recovery requested for non-existent email: ${email}`);
      return;
    }

    // Generar código de recuperación
    const recoveryCode = this.generateRecoveryCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

    // Crear token de verificación
    const verificationToken = this.verificationTokenRepository.create({
      userId: user.userId,
      tokenHash: recoveryCode,
      purpose: 'password_reset',
      expiresAt,
    });

    await this.verificationTokenRepository.save(verificationToken);

    // Aquí se enviaría el email con el código
    this.logger.log(`Password recovery code sent to ${email}: ${recoveryCode}`);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailNormalized: email.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await this.passwordHasher.hashPassword(newPassword);

    // Actualizar contraseña
    await this.userRepository.update(user.userId, {
      passwordHash: hashedPassword,
    });

    // Revocar todos los tokens de verificación del usuario
    await this.verificationTokenRepository.update(
      { userId: user.userId, purpose: 'password_reset' },
      { usedAt: new Date() }
    );

    this.logger.log(`Password updated for user: ${email}`);
  }

  private generateRecoveryCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
