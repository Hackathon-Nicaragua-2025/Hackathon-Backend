import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';
import { RoleDto } from './role.dto';

export class LoginResponseDto extends UserResponseDto {
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
