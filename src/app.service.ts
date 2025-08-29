import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🦅 AviFy - Plataforma de Aviturismo Nicaragua';
  }
}
