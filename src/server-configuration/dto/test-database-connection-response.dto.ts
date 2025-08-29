// src/config/dto/test-database-connection-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

// DTO for individual database configuration response
export class DatabaseResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the database configuration.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'MyDatabase', description: 'The name of the database.' })
  @Expose()
  databaseName!: string;

  @ApiProperty({ example: true, description: 'Indicates if the database configuration is enabled.' })
  @Expose()
  isEnabled!: boolean;
}

// DTO for the test database connection response containing a list of available databases
export class TestDatabaseConnectionResponseDto {
  @ApiProperty({
    description: 'List of available databases if the connection is successful',
    example: [
      {
        id: 1,
        databaseName: 'MyDatabase',
        isEnabled: true,
      },
    ],
    required: false,
  })
  databases!: DatabaseResponseDto[];
}
