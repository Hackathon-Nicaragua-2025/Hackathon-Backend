// dto/table-review-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class TableReviewResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the table.' })
  @Expose()
  tableId!: number;

  @ApiProperty({ example: '2024-11-01', description: 'The end date of the week this review pertains to.' })
  @Expose()
  @Transform(({ value }) => (value ? value : null), { toPlainOnly: true })
  week!: Date;

  @ApiProperty({ example: 'users_table', description: 'Name of the table being reviewed.' })
  @Expose()
  tableName!: string;

  @ApiProperty({ example: 500000, description: 'Total number of rows in the table.' })
  @Expose()
  rowCount!: number;

  @ApiProperty({ example: 150.75, description: 'Size of the table in megabytes.' })
  @Expose()
  sizeMb!: number;

  @ApiProperty({ example: 1000000, description: 'Total number of reads performed on the table.' })
  @Expose()
  reads!: number;

  @ApiProperty({ example: 500000, description: 'Total number of scans performed on the table.' })
  @Expose()
  scans!: number;

  @ApiProperty({ example: 200000, description: 'Total number of seeks performed on the table.' })
  @Expose()
  seeks!: number;

  @ApiProperty({ example: 300000, description: 'Total number of writes performed on the table.' })
  @Expose()
  writes!: number;

  @ApiProperty({ example: 150000, description: 'Total number of updates performed on the table.' })
  @Expose()
  updates!: number;

  @ApiProperty({
    example: '[{"query":"SELECT * FROM users"}]',
    description: 'List of queries executed on the table, stored as a JSON string.',
  })
  @Expose()
  queryList!: string;

  @ApiProperty({
    example: '[{"index":"IDX_UserID"}]',
    description: 'List of indexes on the table, stored as a JSON string.',
  })
  @Expose()
  indexes!: string;

  @ApiProperty({
    example: '[{"dependency":"orders_table"}]',
    description: 'List of dependencies related to the table, stored as a JSON string.',
  })
  @Expose()
  dependencies!: string;

  @ApiProperty({
    example: '[{"recommendation":"Add index on user_id"}]',
    description: 'List of recommendations for improving the table, stored as a JSON string.',
  })
  @Expose()
  recommendations!: string;

  @ApiProperty({
    example: '2024-11-01T08:00:00Z',
    description: 'Timestamp of the last time the review was performed.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  lastRunTime!: Date;

  @ApiProperty({
    example: '2024-11-08T08:00:00Z',
    description: 'Timestamp of the next scheduled review.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  nextRunTime!: Date;
}
