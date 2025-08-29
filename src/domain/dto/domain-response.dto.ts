import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ApplicationResponseDto } from '../../application/dto/application-response.dto';

export class DomainResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the table.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'domains', description: 'Name of the domain.' })
  @Expose()
  domainName!: string;

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
    description: 'List of applications related to the domain',
    type: [ApplicationResponseDto],
  })
  @Expose()
  applications?: ApplicationResponseDto[];
}
