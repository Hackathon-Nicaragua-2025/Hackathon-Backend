import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ServerDataRetentionResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the server data retention record.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 101, description: 'Identifier of the server associated with this data retention record.' })
  @Expose()
  serverId!: number;

  @ApiProperty({ example: 'PrimaryServer01', description: 'Name of the server.' })
  @Expose()
  serverName!: string;

  @ApiProperty({ example: 30, description: 'Number of days for which data is retained on the server.', nullable: true })
  @Expose()
  retentionDays?: number;
}
