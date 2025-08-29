// dto/database-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class DatabaseResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the database.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'MyServer', description: 'The name of the server hosting the database.' })
  @Expose()
  serverName!: string;

  @ApiProperty({ example: 'MyDatabase', description: 'Optional name for the database.' })
  @Expose()
  name?: string;

  @ApiProperty({ example: '2024-10-28T12:34:56Z', description: 'The creation date of the database.' })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  creationDate!: Date;

  @ApiProperty({ example: 101, description: 'The unique database ID.' })
  @Expose()
  dbId!: number;

  @ApiProperty({ example: 'MainDB', description: 'The database name as registered.' })
  @Expose()
  databaseName!: string;

  @ApiProperty({ example: 150, description: 'Optional compatibility level of the database.' })
  @Expose()
  compatibilityLevel?: number;

  @ApiProperty({ example: 'ONLINE', description: 'Current state description of the database.' })
  @Expose()
  stateDesc?: string;

  @ApiProperty({ example: '2024-10-28T12:34:56Z', description: 'The creation date of the database in the DBMS.' })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  dbCreationDate!: Date;

  @ApiProperty({ example: 120, description: 'Compatibility level of the database in the DBMS.' })
  @Expose()
  dbCompatibilityLevel!: number;

  @ApiProperty({ example: 500.75, description: 'Total size of the database in megabytes.' })
  @Expose()
  totalSizeMb?: number;

  @ApiProperty({ example: 300.5, description: 'Used space of the database in megabytes.' })
  @Expose()
  usedSpaceMb?: number;

  @ApiProperty({ example: 'RESTORING', description: 'Current state of the database.' })
  @Expose()
  dbState?: string;

  @ApiProperty({ example: 'FULL', description: 'Recovery model of the database.' })
  @Expose()
  dbRecoveryModel?: string;

  @ApiProperty({ example: 400, description: 'Total size of data in the database in megabytes.' })
  @Expose()
  dataTotalSizeMb?: number;

  @ApiProperty({ example: 250, description: 'Used data space in the database in megabytes.' })
  @Expose()
  dataUsedSpaceMb?: number;

  @ApiProperty({ example: 100, description: 'Total size of the log in the database in megabytes.' })
  @Expose()
  logTotalSizeMb?: number;

  @ApiProperty({ example: 50, description: 'Used log space in the database in megabytes.' })
  @Expose()
  logUsedSpaceMb?: number;

  @ApiProperty({ example: '2024-10-28T12:34:56Z', description: 'Timestamp of when the data was ingested.' })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestionTimestamp!: Date;

  @ApiProperty({ example: '2024-10-28T12:34:56Z', description: 'Timestamp of when the data was last transformed.' })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp!: Date;
}
