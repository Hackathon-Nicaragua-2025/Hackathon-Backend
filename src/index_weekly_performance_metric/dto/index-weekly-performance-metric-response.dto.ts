// dto/index-weekly-performance-metric-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class IndexWeeklyPerformanceMetricResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the index entry.' })
  @Expose()
  indexId!: number;

  @ApiProperty({ example: '2024-10-28', description: 'The end date of the week for this metric.' })
  @Expose()
  weekEndDate!: Date;

  @ApiProperty({ example: 'IX_User_Id', description: 'The name of the index being measured.' })
  @Expose()
  indexName!: string;

  @ApiProperty({ example: 123.45, description: 'Total number of writes for the index during the week.' })
  @Expose()
  numberOfWrite!: number;

  @ApiProperty({ example: 234.56, description: 'Total number of seeks for the index during the week.' })
  @Expose()
  numberOfSeeks!: number;

  @ApiProperty({ example: 345.67, description: 'Total number of scans for the index during the week.' })
  @Expose()
  numberOfScans!: number;

  @ApiProperty({
    example: '2024-10-28T12:34:56Z',
    description: 'Timestamp indicating when this metric was last transformed in the system.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp!: Date;
}
