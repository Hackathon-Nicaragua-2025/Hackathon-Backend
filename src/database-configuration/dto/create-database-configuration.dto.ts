// src/dto/create-database-configuration.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateDatabaseConfigurationDto {
  @ApiProperty({
    example: 'MyServer',
    description: 'The name of the server hosting the database.',
  })
  @IsNotEmpty({ message: 'Server name is required' })
  @IsString({ message: 'Server name must be a string' })
  @Length(1, 128, { message: 'Server name must be between 1 and 128 characters' })
  @Expose()
  serverName!: string;

  @ApiProperty({
    example: 'MyDatabase',
    description: 'The name of the database.',
  })
  @IsNotEmpty({ message: 'Database name is required' })
  @IsString({ message: 'Database name must be a string' })
  @Length(1, 128, { message: 'Database name must be between 1 and 128 characters' })
  @Expose()
  databaseName!: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the database configuration is enabled.',
  })
  @IsNotEmpty({ message: 'isEnabled is required' })
  @IsBoolean({ message: 'isEnabled must be a boolean value' })
  @Expose()
  isEnabled!: boolean;
}
