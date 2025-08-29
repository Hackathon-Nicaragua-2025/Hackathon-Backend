import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '../exceptions/custom-exceptions';

@Injectable()
export class PasswordHasherService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS');
    if (!saltRounds)
      throw new InternalServerErrorException('BCRYPT_SALT_ROUNDS is not set in the environment variables');
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
