import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';
import { RoleDto } from './role.dto';

export class LoginResponseDto extends UserResponseDto {
  @ApiProperty({
    title: 'JWT Token',
    example: 'jwt-token',
  })
  @Expose()
  token!: string;

  @ApiProperty({
    title: 'Refresh Token',
    example: 'refresh-token',
  })
  @Expose()
  refreshToken!: string;

  @ApiProperty({
    title: 'Roles',
    type: [RoleDto], // Array of RoleDto objects
    example: [{ id: 1, name: 'Admin' }],
  })
  @Expose()
  @Type(() => RoleDto)
  roles!: RoleDto[]; // Include roles as an array of RoleDto

  @ApiProperty({
    title: 'Permissions',
    type: [String],
    example: ['QUERY_CREATE', 'QUERY_READ', 'QUERY_UPDATE'],
  })
  @Expose()
  permissions!: string[]; // Array to hold permissions
}
