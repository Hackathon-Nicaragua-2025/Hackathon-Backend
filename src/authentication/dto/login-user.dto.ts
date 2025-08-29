import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginUserDto {
  @ApiProperty({
    example: 'juan.carlos@example.com',
    description: 'La dirección de correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'Por favor proporciona una dirección de correo electrónico válida' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @Expose()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'La contraseña del usuario',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password!: string;
}
