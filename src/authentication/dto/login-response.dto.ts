import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RoleDto } from './role.dto';

export class LoginResponseDto {
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
    return 0;
  }
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token de acceso',
  })
  @Expose()
  token!: string;

  @ApiProperty({
    example: 'refresh_token_hash_here',
    description: 'Token de renovación',
  })
  @Expose()
  refreshToken!: string;

  @ApiProperty({
    example: ['bird_catalog_read', 'booking_create'],
    description: 'Permisos del usuario',
    isArray: true,
  })
  @Expose()
  permissions!: string[];

  @ApiProperty({
    type: [RoleDto],
    description: 'Roles del usuario',
  })
  @Expose()
  roles!: RoleDto[];
}
