import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MissingIndexResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the missing index record.' })
  @Expose()
  id!: number;

  @ApiProperty({
    example: 'TestDB',
    description: 'Name of the database associated with the missing index.',
    nullable: true,
  })
  @Expose()
  databaseName?: string;

  @ApiProperty({ example: 'dbo', description: 'Schema name associated with the missing index.', nullable: true })
  @Expose()
  schemaName?: string;

  @ApiProperty({ example: 'Users', description: 'Table name associated with the missing index.', nullable: true })
  @Expose()
  tableName?: string;

  @ApiProperty({
    example: 'SELECT * FROM Users WHERE...',
    description: 'SQL text where the index was missing.',
    nullable: true,
  })
  @Expose()
  sqlText?: string;

  @ApiProperty({ example: 1, description: 'Statement ID related to the missing index.', nullable: true })
  @Expose()
  statementId?: number;

  @ApiProperty({ example: 10, description: 'Number of times the missing index was used.' })
  @Expose()
  usecounts!: number;

  @ApiProperty({ example: 5, description: 'Reference count of the missing index.' })
  @Expose()
  refcounts!: number;

  @ApiProperty({ example: 50.5, description: 'Estimated impact of the missing index.', nullable: true })
  @Expose()
  impact?: number;

  @ApiProperty({ example: 'column1, column2', description: 'Columns used for equality conditions.', nullable: true })
  @Expose()
  equalityColumns?: string;

  @ApiProperty({ example: 'column3', description: 'Columns used for inequality conditions.', nullable: true })
  @Expose()
  inequalityColumns?: string;

  @ApiProperty({ example: 'column4, column5', description: 'Columns included in the missing index.', nullable: true })
  @Expose()
  includeColumns?: string;

  @ApiProperty({
    example: '<QueryPlan>...</QueryPlan>',
    description: 'XML query plan where the index was missing.',
    nullable: true,
  })
  @Expose()
  queryPlan?: string;

  @ApiProperty({ example: 'QkFNRDEyMw==', description: 'Binary handle for the plan.', nullable: false })
  @Expose()
  planHandle!: Buffer;

  @ApiProperty({
    example: 'server01',
    description: 'Name of the server where the missing index was detected.',
    nullable: true,
  })
  @Expose()
  serverName?: string;

  @ApiProperty({
    example: 'TestDB',
    description: 'Name of the database where the missing index was detected.',
    nullable: true,
  })
  @Expose()
  databaseNam?: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Timestamp when the record was ingested.' })
  @Expose()
  ingestedTimestamp!: Date;
}
