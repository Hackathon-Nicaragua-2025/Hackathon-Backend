// dto/query-weekly-performance-metric-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class QueryWeeklyPerformanceMetricResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the query entry.' })
  @Expose()
  queryId!: number;

  @ApiProperty({ example: '2024-10-28', description: 'The end date of the week for this metric.' })
  @Expose()
  @Transform(({ value }) => (value ? value : null), { toPlainOnly: true })
  weekEndDate!: string;

  @ApiProperty({ example: 'Buffer', description: 'Binary hash representing the query execution.' })
  @Expose()
  queryHash!: Buffer;

  @ApiProperty({
    example: 100,
    description: 'Total count of query executions performed during the week.',
  })
  @Expose()
  executionCount!: number;

  @ApiProperty({
    example: 5000,
    description: 'Aggregate CPU time (in ms) spent on the query during the week.',
  })
  @Expose()
  cpuTime!: number;

  @ApiProperty({
    example: 10000,
    description: 'Total elapsed time (in ms) for all executions of the query during the week.',
  })
  @Expose()
  elapsedTime!: number;

  @ApiProperty({
    example: 3000,
    description: 'Total logical reads performed during query execution for the week.',
  })
  @Expose()
  logicalReads!: number;

  @ApiProperty({
    example: 1500,
    description: 'Total logical writes performed during query execution for the week.',
  })
  @Expose()
  logicalWrites!: number;

  @ApiProperty({
    example: '2024-10-31T12:34:56Z',
    description: 'Timestamp indicating when the data was transformed.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp!: Date;
}
