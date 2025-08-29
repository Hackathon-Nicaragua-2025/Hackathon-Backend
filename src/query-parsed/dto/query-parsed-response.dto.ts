// dto/query-parsed-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class QueryParsedResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the parsed query record.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 101, description: 'Identifier for the original query.' })
  @Expose()
  queryId!: number;

  @ApiProperty({
    example: 'Table',
    description: 'The type of element parsed from the query, such as "Table" or "Column".',
  })
  @Expose()
  elementType!: string;

  @ApiProperty({ example: 'users', description: 'The value of the parsed element, such as a table or column name.' })
  @Expose()
  elementValue!: string;

  @ApiProperty({
    example: '2023-10-28T12:34:56Z',
    description: 'Timestamp when the query element was last transformed.',
  })
  @Expose()
  @Transform(({ value }) => (value ? value.toISOString() : null), { toPlainOnly: true })
  transformedTimestamp!: Date;
}
