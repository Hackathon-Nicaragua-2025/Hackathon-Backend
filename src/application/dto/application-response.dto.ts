import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { QueryResponseDto } from '../../query/dto/query-response.dto';
import { DomainResponseDto } from '../../domain/dto/domain-response.dto';

export class ApplicationResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the application.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'applications', description: 'Name of the application.' })
  @Expose()
  applicationName!: string;

  @ApiProperty({ example: true, description: 'Whether the record is active or inactive.' })
  @Expose()
  isActive!: boolean;

  @ApiProperty({ example: '2024-08-20T10:00:00.000Z', description: 'Timestamp of when the domain data was ingested.' })
  @Expose()
  ingestedDate!: Date;

  @ApiProperty({ example: '2024-08-21T10:00:00.000Z', description: 'Timestamp of when the data was transformed.' })
  @Expose()
  transformedTimestamp!: Date;

  @ApiProperty({
    type: DomainResponseDto,
    description: 'Details of the specific domain associated with this application.',
  })
  @Expose()
  query?: DomainResponseDto;

  @ApiProperty({
    description: 'List of queries related to the record',
    type: [QueryResponseDto],
  })
  @Expose()
  queries?: QueryResponseDto[];
}
