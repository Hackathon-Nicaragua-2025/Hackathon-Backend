import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateTableDto {
  @ApiProperty({
    example: 'users',
    description: 'Name of the table. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Table name is required' })
  @IsString({ message: 'Table name must be a string' })
  @Expose()
  tableName!: string;

  @ApiProperty({
    example: 'db_prod',
    description: 'Name of the database to which the table belongs. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Database name is required' })
  @IsString({ message: 'Database name must be a string' })
  @Expose()
  databaseName!: string;

  @ApiProperty({
    example: 'server01',
    description: 'Name of the server hosting the table. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Server name is required' })
  @IsString({ message: 'Server name must be a string' })
  @Expose()
  serverName!: string;

  @ApiProperty({
    example: 1000,
    description: 'Number of rows in the table. Must be a non-negative integer.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Row count must be an integer' })
  @Min(0, { message: 'Row count cannot be negative' })
  @Expose()
  rowCount?: number;

  @ApiProperty({
    example: 150,
    description: 'Size of the table in megabytes. Must be a non-negative integer.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Size in MB must be an integer' })
  @Min(0, { message: 'Size in MB cannot be negative' })
  @Expose()
  sizeMb?: number;

  @ApiProperty({
    example: 5000,
    description: 'Total number of read operations on the table. Must be a non-negative integer.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Total reads must be an integer' })
  @Min(0, { message: 'Total reads cannot be negative' })
  @Expose()
  totalReads?: number;

  @ApiProperty({
    example: 1000,
    description: 'Total number of write operations on the table. Must be a non-negative integer.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Total writes must be an integer' })
  @Min(0, { message: 'Total writes cannot be negative' })
  @Expose()
  totalWrites?: number;

  @ApiProperty({
    example: 500,
    description: 'Total number of update operations on the table. Must be a non-negative integer.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Total updates must be an integer' })
  @Min(0, { message: 'Total updates cannot be negative' })
  @Expose()
  totalUpdates?: number;

  @ApiProperty({
    example: 200,
    description: 'Total number of scan operations on the table. Must be a non-negative integer.',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Total scans must be an integer' })
  @Min(0, { message: 'Total scans cannot be negative' })
  @Expose()
  totalScans?: number;

  @ApiProperty({
    example: 'public',
    description: 'Schema name to which the table belongs. Must be a valid string.',
  })
  @IsNotEmpty({ message: 'Schema name is required' })
  @IsString({ message: 'Schema name must be a string' })
  @Expose()
  schemaName!: string;
}
