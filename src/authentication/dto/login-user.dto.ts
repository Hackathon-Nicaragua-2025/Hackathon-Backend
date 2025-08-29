import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    minLength: 5,
    maxLength: 100,
    format: 'email',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @Expose()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
    format: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @Expose()
  password!: string;
}
