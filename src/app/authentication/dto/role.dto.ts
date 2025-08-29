import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleDto {
  @ApiProperty({
    example: 1,
    description: 'ID del rol',
  })
  @Expose()
  roleId!: number;

  @ApiProperty({
    example: 'Turista',
    description: 'Nombre del rol',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    example: 'Usuario registrado estándar',
    description: 'Descripción del rol',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si es un rol del sistema',
  })
  @Expose()
  isSystem!: boolean;
}
