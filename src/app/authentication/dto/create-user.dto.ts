import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsIn,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Carlos',
    description: 'El nombre completo del usuario. Solo letras y espacios están permitidos.',
    minLength: 2,
    maxLength: 200,
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
  })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Expose()
  nombre!: string;

  @ApiProperty({
    example: 'juan.carlos@example.com',
    description: 'La dirección de correo electrónico del usuario',
    format: 'email',
  })
  @IsEmail({}, { message: 'Por favor proporciona una dirección de correo electrónico válida' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @Expose()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'La contraseña del usuario. Debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
    minLength: 8,
    maxLength: 50,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial',
  })
  @Exclude({ toPlainOnly: true })
  password!: string;

  @ApiProperty({
    example: '+505 8888 8888',
    description: 'El número de teléfono del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El teléfono no puede exceder 50 caracteres' })
  @Expose()
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL del avatar del usuario (opcional)',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Por favor proporciona una URL válida para el avatar' })
  @Expose()
  avatarUrl?: string;

  @ApiProperty({
    example: ['Turista'],
    description: 'Roles asignados al usuario. Debe ser uno de los roles predefinidos.',
    isArray: true,
    enum: ['Turista', 'Guia', 'Admin'],
    default: ['Turista'],
  })
  @IsArray({ message: 'Los roles deben ser un array' })
  @ArrayNotEmpty({ message: 'Los roles no pueden estar vacíos' })
  @IsString({ each: true, message: 'Cada rol debe ser una cadena de texto' })
  @IsIn(['Turista', 'Guia', 'Admin'], {
    each: true,
    message: 'Cada rol debe ser uno de los siguientes: Turista, Guia, Admin',
  })
  @Expose()
  roles: string[] = ['Turista']; // Por defecto, todos los usuarios nuevos son Turistas
}
