import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsDate, Matches, Min, Max, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateServerConfigurationDto {
  @ApiProperty({
    example: 'Server-01',
    description: 'The unique name of the server. Must be between 3 and 50 characters.',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Server name must be a string' })
  @Length(3, 50, { message: 'Server name must be between 3 and 50 characters' })
  serverName!: string;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'The IP address of the server in IPv4 format.',
    pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
  })
  @IsString({ message: 'IP address must be a valid string' })
  /*@Matches(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, {
    message: 'IP address must be a valid IPv4 address',
  })*/
  ipAddress!: string;

  @ApiProperty({
    example: 'mssql',
    description:
      'The type of database driver. Possible values: mysql, mariadb, postgres, cockroachdb, sqlite, better-sqlite3, oracle, mssql, mongodb, cordova, nativescript, react-native, sqljs, sap.',
    enum: [
      'mysql',
      'mariadb',
      'postgres',
      'cockroachdb',
      'sqlite',
      'better-sqlite3',
      'oracle',
      'mssql',
      'mongodb',
      'cordova',
      'nativescript',
      'react-native',
      'sqljs',
      'sap',
    ],
  })
  @IsString({ message: 'Driver must be a string' })
  @Matches(
    /^(mysql|mariadb|postgres|cockroachdb|sqlite|better-sqlite3|oracle|mssql|mongodb|cordova|nativescript|react-native|sqljs|sap)$/,
    {
      message: 'Driver must be one of the supported values.',
    },
  )
  driver!: string;

  @ApiProperty({
    example: 'Daily',
    description: 'The frequency at which updates are applied. Possible values: Daily, Weekly, or Monthly.',
    enum: ['Daily', 'Weekly', 'Monthly'],
  })
  @IsString({ message: 'Update frequency must be a string' })
  @Matches(/^(Daily|Weekly|Monthly)$/, { message: 'Update frequency must be either Daily, Weekly, or Monthly' })
  updateFrequency!: string;

  @ApiProperty({
    example: 30,
    description: 'Timeout duration in seconds. Must be between 1 and 3600.',
    minimum: 1,
    maximum: 3600,
  })
  @IsInt({ message: 'Timeout must be an integer' })
  @Min(1, { message: 'Timeout must be at least 1 second' })
  @Max(3600, { message: 'Timeout cannot exceed 3600 seconds (1 hour)' })
  timeout!: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the server configuration is enabled or disabled.',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isEnabled must be a boolean value' })
  isEnabled!: boolean;

  @ApiProperty({
    example: 'admin',
    description: 'The user associated with the server configuration. Optional field.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'User must be a string' })
  user?: string;

  @ApiProperty({
    example: 'securePassword',
    description: 'The password for the server configuration. Optional field.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  password?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The last run time of the server. Optional field.',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? null : new Date(value)))
  @IsDate({ message: 'Last run time must be a valid date' })
  @Type(() => Date)
  lastRunTime?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The next scheduled run time. Optional field.',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? null : new Date(value)))
  @IsDate({ message: 'Next run time must be a valid date' })
  @Type(() => Date)
  nextRunTime?: Date;
}
