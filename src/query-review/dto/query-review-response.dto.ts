import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class QueryReviewResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the query review.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 123, description: 'Identifier for the related query.' })
  @Expose()
  queryId!: number;

  @ApiProperty({
    example: 'SELECT * FROM users WHERE id = ?',
    description: 'Text of the SQL query being reviewed.',
    nullable: true,
  })
  @Expose()
  queryText?: string;

  @ApiProperty({
    example: '/src/app/services/user.service.ts',
    description: 'Location in the code where the query is found.',
    nullable: true,
  })
  @Expose()
  codeLocation?: string;

  @ApiProperty({ example: 'Pending', description: 'Current status of the query review.', nullable: true })
  @Expose()
  status?: string;

  @ApiProperty({
    example: 'a9f5f6d7f3a21c8f',
    description: 'Hash key for identifying the query uniquely.',
    nullable: true,
  })
  @Expose()
  hashKey?: string;

  @ApiProperty({
    example: '{"executionTime": "120ms", "rowsScanned": 500}',
    description: 'Performance metrics related to the query execution.',
    nullable: true,
  })
  @Expose()
  performanceMetrics?: string;

  @ApiProperty({
    example: 'SELECT * FROM users',
    description: 'Highlighted portion of the query text for review purposes.',
    nullable: true,
  })
  @Expose()
  highlightedText?: string;

  @ApiProperty({ example: 45, description: 'Identifier for the associated recommendation, if any.', nullable: true })
  @Expose()
  recommendationId?: number;
}
