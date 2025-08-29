// dto/table-weekly-performance-metric-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class TableWeeklyPerformanceMetricResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the table.' })
  @Expose()
  tableId!: number;

  @ApiProperty({ example: '2024-11-01', description: 'The end date of the week for this metric.' })
  @Expose()
  @Transform(({ value }) => (value ? value : null), { toPlainOnly: true })
  weekEndDate!: Date;

  @ApiProperty({ example: 'users_table', description: 'Name of the table being analyzed.' })
  @Expose()
  tableName!: string;

  @ApiProperty({ example: 'main_database', description: 'Name of the database containing the table.' })
  @Expose()
  databaseName!: string;

  @ApiProperty({ example: 'server01', description: 'Name of the server where the table is hosted.' })
  @Expose()
  serverName!: string;

  @ApiProperty({ example: 100000, description: 'Total row count in the table.' })
  @Expose()
  rowCount!: number;

  @ApiProperty({ example: 1024, description: 'Size of the table in megabytes.' })
  @Expose()
  sizeMb!: number;

  @ApiProperty({ example: 5000000, description: 'Total reads performed on the table during the week.' })
  @Expose()
  totalReads!: number;

  @ApiProperty({ example: 3000000, description: 'Total writes performed on the table during the week.' })
  @Expose()
  totalWrites!: number;

  @ApiProperty({ example: 1500000, description: 'Total updates performed on the table during the week.' })
  @Expose()
  totalUpdates!: number;

  @ApiProperty({ example: 250000, description: 'Total scans performed on the table during the week.' })
  @Expose()
  totalScans!: number;

  @ApiProperty({
    example: '2024-11-01T08:00:00Z',
    description: 'Timestamp indicating when the data was last transformed.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp!: Date;
}
