import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RoleDto } from './role.dto';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único del usuario',
  })
  @Expose()
  userId!: string;

  @ApiProperty({
    example: 'Juan Carlos',
    description: 'Nombre completo del usuario',
  })
  @Expose()
  nombre!: string;

  @ApiProperty({
    example: 'juan.carlos@example.com',
    description: 'Dirección de correo electrónico del usuario',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    example: '+505 8888 8888',
    description: 'Número de teléfono del usuario',
    required: false,
  })
  @Expose()
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL del avatar del usuario',
    required: false,
  })
  @Expose()
  avatarUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario está verificado',
  })
  @Expose()
  isVerified!: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario está activo',
  })
  @Expose()
  isActive!: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de creación del usuario',
  })
  @Expose()
  createdAt!: Date;

  @ApiProperty({
    example: '2024-01-15T12:00:00Z',
    description: 'Fecha del último inicio de sesión',
    required: false,
  })
  @Expose()
  lastLoginAt?: Date;

  @ApiProperty({
    type: [RoleDto],
    description: 'Roles asignados al usuario',
  })
  @Expose()
  roles!: RoleDto[];
}
