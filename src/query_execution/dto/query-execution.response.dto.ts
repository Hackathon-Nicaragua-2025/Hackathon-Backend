// dto/query-execution-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class QueryExecutionResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the query execution entry.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 123, description: 'Foreign key reference to the original query ID.' })
  @Expose()
  queryId!: number;

  @ApiProperty({ example: 'Buffer', description: 'Binary hash representing the query execution.' })
  @Expose()
  queryHash!: Buffer;

  @ApiProperty({ example: 1, description: 'Identifier of the database where the query was executed.' })
  @Expose()
  databaseId!: number;

  @ApiProperty({ example: 'DatabaseName', description: 'Name of the database involved in the query execution.' })
  @Expose()
  databaseName!: string;

  @ApiProperty({ example: 10, description: 'Identifier of the table involved in the query execution.' })
  @Expose()
  tableId!: number;

  @ApiProperty({ example: 5, description: 'Identifier of the index used during the query execution.' })
  @Expose()
  indexId!: number;

  @ApiProperty({
    example: '2024-10-28T12:34:56Z',
    description: 'Timestamp of when the query was executed.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  executionTime!: Date;

  @ApiProperty({ example: 1000, description: 'Total logical reads performed during query execution.' })
  @Expose()
  logicalReads!: bigint;

  @ApiProperty({ example: 500, description: 'Total logical writes performed during query execution.' })
  @Expose()
  logicalWrites!: bigint;

  @ApiProperty({ example: 200, description: 'Total physical reads performed during query execution.' })
  @Expose()
  physicalReads!: bigint;

  @ApiProperty({ example: 150, description: 'CPU time (in ms) spent on query execution.' })
  @Expose()
  cpuTime!: bigint;

  @ApiProperty({ example: 1200, description: 'Elapsed time (in ms) for the query execution.' })
  @Expose()
  elapsedTime!: number;

  @ApiProperty({ example: 300, description: 'Logical reads on the table during query execution.' })
  @Expose()
  readsOnTable!: bigint;

  @ApiProperty({ example: 100, description: 'Logical writes on the table during query execution.' })
  @Expose()
  writesOnTable!: bigint;

  @ApiProperty({ example: 10, description: 'Index seeks performed during query execution.' })
  @Expose()
  seeksOnIndex!: bigint;

  @ApiProperty({
    example: '2024-10-29T12:34:56Z',
    description: 'Timestamp of the last execution of the query.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  lastExecutionTime!: Date;

  @ApiProperty({ example: 5, description: 'Number of times the query has been executed.' })
  @Expose()
  executionCount!: number;

  @ApiProperty({ example: 'ServerName', description: 'Name of the server where the query was executed.' })
  @Expose()
  serverName!: string;

  @ApiProperty({
    example: '2024-10-30T12:34:56Z',
    description: 'Date when the execution data was first ingested into the system.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestedDate!: Date;

  @ApiProperty({
    example: '2024-10-30T12:34:56Z',
    description: 'Exact timestamp when the execution data was ingested.',
  })
  @Expose()
  ingestionTimestamp!: Date;

  @ApiProperty({
    example: '2024-10-31T12:34:56Z',
    description: 'Timestamp indicating the last data transformation.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp!: Date;
}
