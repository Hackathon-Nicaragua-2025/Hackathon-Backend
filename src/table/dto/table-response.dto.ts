import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RecommendationTableResponseDto } from '../../table-recommendation/dto/table-recommendation-response.dto';
import { DatabaseResponseDto } from '../../database/dto/database-response.dto';
import { IndexResponseDto } from '../../index/dto/index-response.dto';

export class TableResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the table.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'users', description: 'Name of the table.' })
  @Expose()
  tableName!: string;

  @ApiProperty({ example: 'db_prod', description: 'Name of the database to which the table belongs.' })
  @Expose()
  databaseName!: string;

  @ApiProperty({ example: 'server01', description: 'Name of the server hosting the table.' })
  @Expose()
  serverName!: string;

  @ApiProperty({ example: 1000, description: 'Number of rows in the table.' })
  @Expose()
  rowCount?: number;

  @ApiProperty({ example: 150, description: 'Size of the table in megabytes.' })
  @Expose()
  sizeMb?: number;

  @ApiProperty({ example: 5000, description: 'Total number of read operations on the table.' })
  @Expose()
  totalReads?: number;

  @ApiProperty({ example: 1000, description: 'Total number of write operations on the table.' })
  @Expose()
  totalWrites?: number;

  @ApiProperty({ example: 500, description: 'Total number of update operations on the table.' })
  @Expose()
  totalUpdates?: number;

  @ApiProperty({ example: 200, description: 'Total number of scan operations on the table.' })
  @Expose()
  totalScans?: number;

  @ApiProperty({ example: 'public', description: 'Schema name to which the table belongs.' })
  @Expose()
  schemaName!: string;

  @ApiProperty({ example: '2024-08-20T10:00:00.000Z', description: 'Timestamp of when the table data was ingested.' })
  @Expose()
  ingestedDate!: Date;

  @ApiProperty({
    example: '2024-08-20T11:00:00.000Z',
    description: 'Timestamp of when the data was last ingested into the system.',
  })
  @Expose()
  ingestedTimestamp!: Date;

  @ApiProperty({ example: '2024-08-21T10:00:00.000Z', description: 'Timestamp of when the data was transformed.' })
  @Expose()
  transformedTimestamp!: Date;

  @ApiProperty({
    description: 'List of recommendations related to the table for optimization or tuning',
    type: [RecommendationTableResponseDto],
  })
  @Expose()
  recommendations?: RecommendationTableResponseDto[];

  @ApiProperty({
    description: 'Database related to the table',
    type: DatabaseResponseDto,
  })
  @Expose()
  database?: DatabaseResponseDto;

  @ApiProperty({
    description: 'Indexes related to the table',
    type: IndexResponseDto,
  })
  @Expose()
  indexes?: IndexResponseDto;
}
