import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsInt, IsOptional, IsNumber, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQueryDto {
  @ApiProperty({
    example: 'SELECT * FROM users WHERE id = 1',
    description: 'The SQL query text to be executed.',
    nullable: false,
    minLength: 5,
  })
  @IsNotEmpty({ message: 'Statement text is required' })
  @IsString({ message: 'Statement text must be a string' })
  @Length(5, undefined, { message: 'Statement text must be at least 5 characters long' })
  statementText!: string;

  @ApiProperty({
    example: 'MyServer',
    description: 'The name of the server where the query was executed.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Server name must be a string' })
  serverName?: string;

  @ApiProperty({
    example: 'MyDatabase',
    description: 'The name of the database where the query was executed.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Database name must be a string' })
  databaseName?: string;

  @ApiProperty({
    example: 100,
    description: 'Average logical reads performed by the query.',
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Average logical reads must be a number' })
  avgLogicalReads?: number;

  @ApiProperty({
    example: 50,
    description: 'Average logical writes performed by the query.',
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Average logical writes must be a number' })
  avgLogicalWrites?: number;

  @ApiProperty({
    example: 200,
    description: 'Average worker time used by the query (in milliseconds).',
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Average worker time must be a number' })
  avgWorkerTime?: number;

  @ApiProperty({
    example: 300,
    description: 'Average elapsed time for the query (in milliseconds).',
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Average elapsed time must be a number' })
  avgElapsedTime?: number;

  @ApiProperty({
    example: 1,
    description: 'Number of times the query has been executed.',
    nullable: true,
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Execution count must be an integer' })
  @Min(1, { message: 'Execution count must be at least 1' })
  executionCount?: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The last time the query was executed.',
    nullable: true,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate({ message: 'Last execution time must be a valid date' })
  @Type(() => Date)
  lastExecutionTime?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The date when the query was ingested into the system.',
    nullable: true,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate({ message: 'Ingestion timestamp must be a valid date' })
  @Type(() => Date)
  ingestionTimestamp?: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'The timestamp of when the data was transformed.',
    nullable: false,
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'Transformed timestamp is required' })
  @IsDate({ message: 'Transformed timestamp must be a valid date' })
  @Type(() => Date)
  transformedTimestamp!: Date;
}
