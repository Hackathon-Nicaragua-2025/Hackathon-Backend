import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({
    example: 'Admin',
    enum: ['Admin', 'Manager', 'Supervisor', 'Viewer', 'User'],
  })
  @Expose()
  name!: string;
}
