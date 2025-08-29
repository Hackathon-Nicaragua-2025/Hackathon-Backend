import { IsInt, IsString, IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class QueryExecutionResponseDto {
  @ApiProperty({ description: 'Unique identifier for the query execution' })
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({ description: 'ID of the original query' })
  @IsInt()
  @Expose()
  queryId!: number;

  @ApiProperty({ description: 'Binary hash of the query', type: 'string', format: 'binary' })
  @Transform(({ value }) => value.toString('hex'), { toPlainOnly: true })
  @Expose()
  queryHash!: Buffer;

  @ApiProperty({ description: 'Name of the database where the query was executed', example: 'my_database' })
  @IsString()
  @Expose()
  databaseName?: string;

  @ApiProperty({ description: 'Time when the query execution was created' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Expose()
  creationTime?: Date;

  @ApiProperty({ description: 'Timestamp of the last execution of this query' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Expose()
  lastExecutionTime?: Date;

  @ApiProperty({ description: 'Total number of times the query was executed' })
  @IsNumber()
  @Expose()
  executionCount?: number;

  @ApiProperty({ description: 'CPU time in milliseconds spent on query execution' })
  @IsNumber()
  @Expose()
  cpuTime?: number;

  @ApiProperty({ description: 'Elapsed time in milliseconds for the query execution' })
  @IsNumber()
  @Expose()
  elapsedTime?: number;

  @ApiProperty({ description: 'Number of logical reads performed during query execution' })
  @IsNumber()
  @Expose()
  logicalReads?: number;

  @ApiProperty({ description: 'Number of logical writes performed during query execution' })
  @IsNumber()
  @Expose()
  logicalWrites?: number;

  @ApiProperty({ description: 'Server name where the query was executed' })
  @IsString()
  @Expose()
  serverName!: string;

  @ApiProperty({ description: 'Timestamp indicating when the data was transformed' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Expose()
  transformedTimestamp!: Date;
}
