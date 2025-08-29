// dto/recommendation-list-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RecommendationListResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the recommendation.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Optimize Database Indexing', description: 'Title of the recommendation.' })
  @Expose()
  recommendationTitle!: string;

  @ApiProperty({
    example: 'This recommendation involves optimizing database indexing for performance.',
    description: 'Definition of the recommendation.',
  })
  @Expose()
  recommendationDefinition!: string;

  @ApiProperty({ example: 'Performance', description: 'Type or category of the recommendation.' })
  @Expose()
  recommendationType!: string;
}
