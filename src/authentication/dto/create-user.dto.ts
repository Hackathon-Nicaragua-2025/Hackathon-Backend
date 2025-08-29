import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsIn,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user. Only letters and spaces are allowed.',
    minLength: 2,
    maxLength: 50,
    pattern: '^[a-zA-Z\\s]+$',
  })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters and spaces' })
  @IsNotEmpty({ message: 'First name is required' })
  @Expose()
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user. Only letters and spaces are allowed.',
    minLength: 2,
    maxLength: 50,
    pattern: '^[a-zA-Z\\s]+$',
  })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Expose()
  lastName!: string;

  @ApiProperty({
    example: 25,
    description: 'The age of the user. Must be an integer between 0 and 120.',
    minimum: 0,
    maximum: 120,
  })
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age cannot be less than 0' })
  @Max(120, { message: 'Age cannot exceed 120' })
  @Expose()
  age!: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Expose()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'The password of the user. Must contain at least one uppercase letter, one lowercase letter, and one number.',
    minLength: 6,
    maxLength: 50,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @Exclude({ toPlainOnly: true }) // Exclude password in plain response
  password!: string;

  @ApiProperty({
    example: ['Admin', 'Manager'],
    description: 'Roles assigned to the user. Must be one of the predefined roles.',
    isArray: true,
    enum: ['Admin', 'Manager', 'Supervisor', 'Viewer', 'User'],
  })
  @IsArray({ message: 'Roles must be an array' })
  @ArrayNotEmpty({ message: 'Roles cannot be empty' })
  @IsString({ each: true, message: 'Each role must be a string' })
  @IsIn(['Admin', 'Manager', 'Supervisor', 'Viewer', 'User'], {
    each: true,
    message: 'Each role must be one of the following: Admin, Manager, Supervisor, Viewer, User',
  })
  @Expose()
  roles!: string[];
}
