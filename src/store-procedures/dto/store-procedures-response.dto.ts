import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StoreProceduresResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the stored procedure record.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'uspGetUserDetails', description: 'Name of the stored procedure.' })
  @Expose()
  procedureName!: string;

  @ApiProperty({
    example: 'CREATE PROCEDURE uspGetUserDetails AS BEGIN ... END',
    description: 'Definition of the stored procedure.',
    nullable: true,
  })
  @Expose()
  procedureDefinition?: string;

  @ApiProperty({
    example: 'Server01',
    description: 'Name of the server where the stored procedure is located.',
    nullable: true,
  })
  @Expose()
  serverName?: string;

  @ApiProperty({
    example: 'TestDB',
    description: 'Name of the database where the stored procedure is located.',
    nullable: true,
  })
  @Expose()
  databaseNam?: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Timestamp when the record was ingested.' })
  @Expose()
  ingestedTimestamp!: Date;
}
