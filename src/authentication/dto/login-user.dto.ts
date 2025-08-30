import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'admin@avify.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'AdminPassword123!',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
