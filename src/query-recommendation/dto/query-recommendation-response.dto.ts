import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { QueryResponseDto } from '../../query/dto/query-response.dto';

export class RecommendationQueryResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the recommendation.' })
  @Expose()
  id!: number;

  @ApiProperty({
    example: 'Optimize database indexes for better query performance.',
    description: 'Summary of the recommendation.',
  })
  @Expose()
  summary?: string;

  @ApiProperty({
    example: 'Indexes are not optimized for the current query patterns.',
    description: 'Detailed explanation of the recommendation.',
  })
  @Expose()
  detailedExplanation?: string;

  @ApiProperty({
    example: 'Analyze current query patterns and create new indexes for frequently accessed data.',
    description: 'Plan for implementing the recommendation.',
  })
  @Expose()
  implementationPlan?: string;

  @ApiProperty({
    example: 'Improved query performance and reduced database load.',
    description: 'Impact of the recommendation on the query and database performance.',
  })
  @Expose()
  impact?: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current status of the recommendation (e.g., OPEN, CLOSED, or IN_PROGRESS).',
    enum: ['OPEN', 'CLOSED', 'IN_PROGRESS'],
  })
  @Expose()
  status?: string;

  @ApiProperty({
    example: 'jdoe',
    description: 'Identifier of the user who created the recommendation.',
  })
  @Expose()
  createdBy?: string;

  @ApiProperty({
    description: 'Timestamp of when the recommendation was created.',
    example: '2024-11-02T12:34:56.789Z',
  })
  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined), { toClassOnly: true })
  createdAt?: Date;

  @ApiProperty({
    description: 'Timestamp of the last modification to the recommendation.',
    example: '2024-11-03T08:00:00.000Z',
  })
  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined), { toClassOnly: true })
  lastModifiedAt?: Date;

  @ApiProperty({
    description: 'List of IDs of the impacted queries, stored as a long text (nvarchar) field.',
    example: '1,2,3',
  })
  @Expose()
  queriesImpacted?: string;

  @ApiProperty({
    type: QueryResponseDto,
    description: 'Details of the specific query associated with this recommendation.',
  })
  @Expose()
  query?: QueryResponseDto;
}
