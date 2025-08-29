// dto/stats-per-index-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class StatsPerIndexResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the stats per index entry.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'dbo', description: 'Schema name where the table resides.' })
  @Expose()
  schemaName!: string;

  @ApiProperty({ example: 'Employees', description: 'Name of the table associated with the index.' })
  @Expose()
  tableName!: string;

  @ApiProperty({ example: 'IX_Employee_Name', description: 'Name of the index on the table.', nullable: true })
  @Expose()
  indexName?: string;

  @ApiProperty({
    example: 'NONCLUSTERED',
    description: 'Description of the index type (e.g., CLUSTERED, NONCLUSTERED).',
    nullable: true,
  })
  @Expose()
  typeDesc?: string;

  @ApiProperty({ example: 1000, description: 'Total number of write operations on the index.', nullable: true })
  @Expose()
  numberOfWrite?: number;

  @ApiProperty({ example: 200, description: 'Total number of seek operations on the index.', nullable: true })
  @Expose()
  numberOfSeeks?: number;

  @ApiProperty({ example: 150, description: 'Total number of scan operations on the index.', nullable: true })
  @Expose()
  numberOfScans?: number;

  @ApiProperty({ example: 'Server123', description: 'Name of the server hosting the database.', nullable: true })
  @Expose()
  serverName?: string;

  @ApiProperty({ example: 'EmployeeDB', description: 'Name of the database containing the table.', nullable: true })
  @Expose()
  databaseName?: string;

  @ApiProperty({
    example: '2024-10-28T12:34:56Z',
    description: 'Timestamp when the statistics were ingested into the system.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestedTimestamp!: Date;
}
