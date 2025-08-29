// dto/index-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { TableResponseDto } from '../../table/dto/table-response.dto';

export class IndexResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the index entry.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 101, description: 'Identifier of the index within the database system.' })
  @Expose()
  indexId!: number;

  @ApiProperty({ example: 202, description: 'Object identifier associated with the index.' })
  @Expose()
  objectId!: number;

  @ApiProperty({ example: 'Users', description: 'Name of the table on which the index is applied.' })
  @Expose()
  tableName!: string;

  @ApiProperty({ example: 'IX_User_Name', description: 'Name of the index, if specified.', nullable: true })
  @Expose()
  indexName?: string;

  @ApiProperty({
    example: 'NONCLUSTERED',
    description: 'Type of the index, such as CLUSTERED or NONCLUSTERED.',
    nullable: true,
  })
  @Expose()
  indexType?: string;

  @ApiProperty({ example: 'name', description: 'Name of the column included in the index.', nullable: true })
  @Expose()
  columnName?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the index key is sorted in descending order.',
    nullable: true,
  })
  @Expose()
  isDescendingKey?: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if the column is included as a non-key column in the index.',
    nullable: true,
  })
  @Expose()
  isIncludedColumn?: boolean;

  @ApiProperty({ example: 'Server123', description: 'Name of the server hosting the database.', nullable: true })
  @Expose()
  serverName?: string;

  @ApiProperty({
    example: 'DatabaseXYZ',
    description: 'Name of the database where the index is stored.',
    nullable: true,
  })
  @Expose()
  databaseName?: string;

  @ApiProperty({
    example: '2024-10-28T12:34:56Z',
    description: 'Timestamp indicating when the index data was ingested into the system.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  ingestedTimestamp!: Date;

  @ApiProperty({
    example: '2024-11-01T08:00:00Z',
    description: 'Timestamp indicating when the data was last transformed in the system.',
    nullable: true,
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp?: Date;

  @ApiProperty({
    description: 'Table associated to the index',
    type: TableResponseDto,
  })
  @Expose()
  table?: TableResponseDto;
}
