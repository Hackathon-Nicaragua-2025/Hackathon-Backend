import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RecommendationTableResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the recommendation.' })
  @Expose()
  id!: number;

  @ApiProperty({
    example: 'Optimize index usage',
    description: 'Summary of the recommendation.',
  })
  @Expose()
  summary?: string;

  @ApiProperty({
    example: 'The indexes are not optimized for the current query patterns.',
    description: 'Detailed explanation of the recommendation.',
  })
  @Expose()
  detailedExplanation?: string;

  @ApiProperty({
    example: 'Implement indexes on frequently accessed columns.',
    description: 'Plan for implementing the recommendation.',
  })
  @Expose()
  implementationPlan?: string;

  @ApiProperty({
    example: 'Reduced query time by optimizing the indexes.',
    description: 'Impact of the recommendation.',
  })
  @Expose()
  impact?: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current status of the recommendation',
    enum: ['OPEN', 'CLOSED', 'IN_PROGRESS'],
  })
  @Expose()
  status?: string;

  @ApiProperty({
    example: 'jdoe',
    description: 'User who created the recommendation.',
  })
  @Expose()
  createdBy?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Timestamp when the recommendation was created.',
  })
  @Expose()
  createdAt?: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'Timestamp when the recommendation was last modified.',
  })
  @Expose()
  lastModifiedAt?: Date;

  @ApiProperty({
    description: 'List of impacted tables in a string format, if applicable.',
    example: '1,2,3',
  })
  @Expose()
  tablesImpacted?: string;
}
