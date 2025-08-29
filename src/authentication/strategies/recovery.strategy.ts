import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class RecoveryStrategy extends PassportStrategy(Strategy, 'recovery') {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // Esta estrategia se puede usar para validar códigos de recuperación
    // Por ahora está vacía, se puede implementar según las necesidades
    return { username, password };
  }
}
