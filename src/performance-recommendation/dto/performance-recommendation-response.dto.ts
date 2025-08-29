import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PerformanceRecommendationResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the performance recommendation.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 101, description: 'Associated ID for the aggregate model.' })
  @Expose()
  aggId!: number;

  @ApiProperty({
    example: 'Optimize query execution plan to reduce latency',
    description: 'Text of the recommendation.',
  })
  @Expose()
  recommendationText!: string;

  @ApiProperty({ example: 'Performance', description: 'Type of the recommendation.' })
  @Expose()
  recommendationType!: string;

  @ApiProperty({ example: 'High', description: 'Estimated impact of the recommendation.' })
  @Expose()
  impactEstimation!: string;

  @ApiProperty({ example: 'Pending', description: 'Current status of the recommendation.' })
  @Expose()
  status!: string;

  @ApiProperty({ example: '2023-12-01', description: 'Date when the recommendation was implemented.' })
  @Expose()
  implementationDate!: Date;
}
