import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ApplicationStatsResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the application.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'applications', description: 'Name of the application.' })
  @Expose()
  applicationName!: string;

  @ApiProperty({ example: 10, description: 'Queries execution couint by Application.' })
  @Expose()
  executionCount!: number;

  @ApiProperty({ example: 100, description: 'Queries average execution time by Application.' })
  @Expose()
  avgElapsedTime!: number;
}
