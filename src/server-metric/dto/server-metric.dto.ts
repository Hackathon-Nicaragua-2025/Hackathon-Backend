// dto/server-metrics-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ServerMetricsResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the server metric.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Server123', description: 'Name of the server being monitored.' })
  @Expose()
  serverName?: string;

  @ApiProperty({
    example: 5000,
    description: 'Total count of queries executed on the server.',
  })
  @Expose()
  queryCount?: number;

  @ApiProperty({
    example: 10,
    description: 'Total number of databases hosted on the server.',
  })
  @Expose()
  databaseCount?: number;

  @ApiProperty({
    example: 100,
    description: 'Current number of active sessions on the server.',
  })
  @Expose()
  activeSessions?: number;

  @ApiProperty({
    example: 75.5,
    description: 'Percentage of memory usage on the server.',
  })
  @Expose()
  memoryUsagePercent?: number;

  @ApiProperty({
    example: 123456789,
    description: 'Cumulative disk I/O on the server.',
  })
  @Expose()
  totalDiskIo?: number;

  @ApiProperty({
    example: 'PAGEIOLATCH_SH',
    description: 'Type of the last wait event experienced by the server.',
  })
  @Expose()
  lastWaitType?: string;

  @ApiProperty({
    example: 1500,
    description: 'Duration of the last wait on the server, in milliseconds.',
  })
  @Expose()
  lastWaitTimeMs?: number;

  @ApiProperty({
    example: 300,
    description: 'CPU time of the last operation on the server, in milliseconds.',
  })
  @Expose()
  lastCpuTimeMs?: number;

  @ApiProperty({
    example: '2024-10-28T12:34:56Z',
    description: 'Timestamp when the server metrics data was ingested into the system.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestedTimestamp?: Date;
}
