import { IsInt, IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Expose } from 'class-transformer';
import { RecommendationQueryResponseDto } from '../../query-recommendation/dto/query-recommendation-response.dto';
import { QueryExecutionResponseDto } from './query-execution-response.dto';
import { TableResponseDto } from '../../table/dto/table-response.dto';
import { ApplicationResponseDto } from '../../application/dto/application-response.dto';

export class QueryResponseDto {
  @ApiProperty({ description: 'Unique identifier for the query' })
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Name of the server where the query was executed, optional' })
  @IsString()
  @IsOptional()
  @Expose()
  serverName?: string;

  @ApiProperty({ description: 'Name of the database where the query was executed, optional' })
  @IsString()
  @IsOptional()
  @Expose()
  databaseName?: string;

  @ApiProperty({ description: 'The SQL statement text of the query, optional' })
  @IsString()
  @IsOptional()
  @Expose()
  statementText?: string;

  @ApiProperty({
    description: 'Binary hash of the query for identifying unique queries',
    type: 'string',
    format: 'binary',
  })
  @Transform(({ value }) => value.toString('hex'), { toPlainOnly: true })
  @Expose()
  queryHash!: Buffer;

  @ApiProperty({ description: 'Average logical reads made by the query, in units', example: 1024 })
  @IsNumber()
  @IsOptional()
  @Expose()
  avgLogicalReads?: number;

  @ApiProperty({ description: 'Average logical writes made by the query, in units', example: 256 })
  @IsNumber()
  @IsOptional()
  @Expose()
  avgLogicalWrites?: number;

  @ApiProperty({ description: 'Average worker time consumed by the query in milliseconds' })
  @IsNumber()
  @IsOptional()
  @Expose()
  avgWorkerTime?: number;

  @ApiProperty({ description: 'Average elapsed time of the query execution in milliseconds' })
  @IsNumber()
  @IsOptional()
  @Expose()
  avgElapsedTime?: number;

  @ApiProperty({ description: 'Total number of times the query was executed' })
  @IsInt()
  @IsOptional()
  @Expose()
  executionCount?: number;

  @ApiProperty({ description: 'Timestamp of the last execution of the query', example: '2024-11-02T12:34:56.789Z' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  @Expose()
  lastExecutionTime?: Date;

  @ApiProperty({ description: 'Timestamp when the query data was initially ingested into the system' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  @Expose()
  ingestionTimestamp?: Date;

  @ApiProperty({ description: 'Timestamp indicating the last transformation or processing of the data' })
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Expose()
  transformedTimestamp!: Date;

  @ApiProperty({
    description: 'List of recommendations related to the query for optimization or tuning',
    type: [RecommendationQueryResponseDto],
  })
  @IsOptional()
  @Expose()
  recommendations?: RecommendationQueryResponseDto[];

  @ApiProperty({
    description: 'Details of individual query executions associated with this query',
    type: [QueryExecutionResponseDto],
  })
  @IsOptional()
  @Expose()
  queryExecution?: QueryExecutionResponseDto[];

  @ApiProperty({
    description: 'List of tables associated with this query',
    type: [TableResponseDto],
  })
  @IsOptional()
  @Expose()
  tables?: TableResponseDto[];

  @ApiProperty({
    description: 'Application',
    type: ApplicationResponseDto,
  })
  @IsOptional()
  @Expose()
  application?: ApplicationResponseDto;
}
