import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DomainStatsResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the domain.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'domains', description: 'Name of the domain.' })
  @Expose()
  domainName!: string;

  @ApiProperty({ example: 10, description: 'Queries execution couint by domain.' })
  @Expose()
  executionCount!: number;

  @ApiProperty({ example: 100, description: 'Queries average execution time by domain.' })
  @Expose()
  avgElapsedTime!: number;
}
