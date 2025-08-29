// dto/stats-per-table-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class StatsPerTableResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the stats per table entry.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Users', description: 'Name of the table for which the stats are recorded.' })
  @Expose()
  tableName!: string;

  @ApiProperty({ example: 5, description: 'Total count of indexes present on the table.', nullable: true })
  @Expose()
  indexCount?: number;

  @ApiProperty({
    example: 'IX_User_Name, IX_User_Email',
    description: 'Comma-separated names of indexes on the table.',
    nullable: true,
  })
  @Expose()
  indexNames?: string;

  @ApiProperty({ example: 100000, description: 'Total number of rows in the table.', nullable: true })
  @Expose()
  numberOfRows?: number;

  @ApiProperty({
    example: 'OK',
    description: 'Status indicating the similarity of the key structure with other tables.',
  })
  @Expose()
  similarKeyStatus!: string;

  @ApiProperty({ example: 'Server123', description: 'Name of the server where the table is located.', nullable: true })
  @Expose()
  serverName?: string;

  @ApiProperty({ example: 'DatabaseXYZ', description: 'Name of the database containing the table.', nullable: true })
  @Expose()
  databaseName?: string;

  @ApiProperty({
    example: '2024-10-28T12:34:56Z',
    description: 'Timestamp indicating when the data was ingested into the system.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestedTimestamp!: Date;
}
