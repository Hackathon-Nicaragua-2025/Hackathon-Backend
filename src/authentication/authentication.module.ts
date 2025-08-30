import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Role, Permission, RefreshToken, VerificationToken, LoginAudit } from '../common/entities/app';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordHasherService } from '../common/services/password-hasher.service';

@Module({
  controllers: [AuthenticationController],
  providers: [
    PasswordHasherService, 
    AuthenticationService, 
    JwtStrategy
  ],
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Role, 
      Permission, 
      RefreshToken, 
      VerificationToken, 
      LoginAudit
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '3h',
        },
      }),
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthenticationModule {}
