// dto/database-configuration-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ServerConfigurationResponseDto } from '../../server-configuration/dto/server-configuration-response.dto';

export class DatabaseConfigurationResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the database configuration.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'MyDatabase', description: 'The name of the configured database.' })
  @Expose()
  databaseName!: string;

  @ApiProperty({ example: 'MyServer', description: 'The name of the server hosting the database.' })
  @Expose()
  serverName!: string;

  @ApiProperty({ example: true, description: 'Indicates if the database configuration is enabled.' })
  @Expose()
  isEnabled!: boolean;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', description: 'Ingested date' })
  @Expose()
  ingestedDate!: Date;

  @ApiProperty({
    description: 'Details of individual server associated with this database',
    type: ServerConfigurationResponseDto,
  })
  @Expose()
  server?: ServerConfigurationResponseDto;
}
