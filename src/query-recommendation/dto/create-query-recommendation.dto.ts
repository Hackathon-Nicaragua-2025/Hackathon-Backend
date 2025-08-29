import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateRecommendationQueryDto {
  @ApiProperty({
    example: 'Optimize database indexes',
    description: 'A brief summary of the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Summary must be a string' })
  @Expose()
  summary?: string;

  @ApiProperty({
    example: 'Indexes are outdated and need optimization for better performance.',
    description: 'A detailed explanation of the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Detailed explanation must be a string' })
  @Expose()
  detailedExplanation?: string;

  @ApiProperty({
    example: 'Analyze current queries and create new indexes for frequently used fields.',
    description: 'The proposed plan for implementing the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Implementation plan must be a string' })
  @Expose()
  implementationPlan?: string;

  @ApiProperty({
    example: 'Improved query performance and reduced database load.',
    description: 'The expected impact of the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Impact must be a string' })
  @Expose()
  impact?: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current status of the recommendation. Possible values are "OPEN", "CLOSED", or "IN_PROGRESS".',
    enum: ['OPEN', 'CLOSED', 'IN_PROGRESS'],
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  @Length(1, 50, { message: 'Status must be between 1 and 50 characters' })
  @Expose()
  status!: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the query related to this recommendation. Must be a positive integer.',
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Query ID is required' })
  @IsInt({ message: 'Query ID must be an integer' })
  @Expose()
  queryId!: number;

  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'The user who created or last updated the recommendation. This field is optional.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Updated by must be a valid string' })
  @Expose()
  updatedBy?: string;

  @ApiProperty({
    example: '1,2,3',
    description: 'List of IDs of impacted queries, stored as a string of comma-separated values or in JSON format.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Queries impacted must be a string' })
  @Expose()
  queriesImpacted?: string;
}
