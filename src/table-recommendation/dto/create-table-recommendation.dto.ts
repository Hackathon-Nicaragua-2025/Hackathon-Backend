import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn, IsInt } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateTableRecommendationDto {
  @ApiProperty({
    example: 'Optimize database indexes',
    description: 'Summary of the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Summary must be a string' })
  @Expose()
  summary?: string;

  @ApiProperty({
    example: 'The current indexes are not optimized for performance. Create new indexes for high-traffic queries.',
    description: 'Detailed explanation of the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Detailed explanation must be a string' })
  @Expose()
  detailedExplanation?: string;

  @ApiProperty({
    example: 'Analyze existing queries and optimize indexing based on usage patterns.',
    description: 'Plan for implementing the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Implementation plan must be a string' })
  @Expose()
  implementationPlan?: string;

  @ApiProperty({
    example: 'Improved query performance and reduced latency.',
    description: 'Impact of the recommendation.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Impact must be a string' })
  @Expose()
  impact?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the table the recommendation is related to. Must be a positive integer.',
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Table ID is required' })
  @IsInt({ message: 'Table ID must be an integer' })
  @Expose()
  tableId!: number;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current status of the recommendation. Allowed values: OPEN, IN PROGRESS, CLOSED.',
    enum: ['OPEN', 'IN PROGRESS', 'CLOSED'],
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['OPEN', 'IN PROGRESS', 'CLOSED'], { message: 'Status must be either OPEN, IN PROGRESS, or CLOSED' })
  @Expose()
  status!: string;

  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'The email of the user who created or updated the recommendation. Optional field.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Created by must be a valid string' })
  @Expose()
  createdBy?: string;

  @ApiProperty({
    example: '1,2,3',
    description: 'List of IDs of impacted tables, stored as a string of comma-separated values.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tables impacted must be a string' })
  @Expose()
  tablesImpacted?: string;
}
