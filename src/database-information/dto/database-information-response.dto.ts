// dto/database-information-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class DatabaseInformationResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the database information record.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Server1', description: 'The name of the server hosting the database.' })
  @Expose()
  serverName?: string;

  @ApiProperty({ example: 101, description: 'Unique identifier for the database.' })
  @Expose()
  databaseId!: number;

  @ApiProperty({ example: 'MainDB', description: 'The name of the database.' })
  @Expose()
  name!: string;

  @ApiProperty({ example: '2023-10-28T12:34:56Z', description: 'Creation date of the database.' })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  creationDate!: Date;

  @ApiProperty({ example: 120, description: 'Compatibility level of the database.' })
  @Expose()
  compatibilityLevel!: number;

  @ApiProperty({ example: 'ONLINE', description: 'Current state description of the database.' })
  @Expose()
  stateDesc?: string;

  @ApiProperty({ example: 'FULL', description: 'Recovery model of the database.' })
  @Expose()
  recoveryModel?: string;

  @ApiProperty({ example: 500, description: 'Total data size of the database in megabytes.' })
  @Expose()
  dataTotalSizeMb?: number;

  @ApiProperty({ example: 300, description: 'Used data space in the database in megabytes.' })
  @Expose()
  dataUsedSpaceMb?: number;

  @ApiProperty({ example: 100, description: 'Total log size of the database in megabytes.' })
  @Expose()
  logTotalSizeMb?: number;

  @ApiProperty({ example: 50, description: 'Used log space in the database in megabytes.' })
  @Expose()
  logUsedSpaceMb?: number;

  @ApiProperty({ example: '2023-10-28T12:34:56Z', description: 'Timestamp when the record was ingested.' })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestedTimestamp!: Date;
}
