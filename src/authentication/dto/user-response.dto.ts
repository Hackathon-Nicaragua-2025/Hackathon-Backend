import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  @Expose()
  userId!: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  nombre!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ example: '+50512345678' })
  @Expose()
  phone!: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @Expose()
  avatarUrl!: string;

  @ApiProperty({ example: true })
  @Expose()
  isVerified!: boolean;

  @ApiProperty({ example: true })
  @Expose()
  isActive!: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  createdAt!: Date;

  // Propiedades getter para compatibilidad
  get id(): string {
    return this.userId;
  }

  get firstName(): string {
    return this.nombre.split(' ')[0] || this.nombre;
  }

  get lastName(): string {
    const parts = this.nombre.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  get age(): number {
    // Calcular edad basada en fecha de nacimiento si existe, o retornar 0
    return 0; // Por ahora retornamos 0, se puede implementar lógica de edad después
  }
}
