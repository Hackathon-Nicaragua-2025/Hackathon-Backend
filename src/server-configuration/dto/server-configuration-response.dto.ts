import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { DatabaseResponseDto } from '../../database/dto/database-response.dto';

export class ServerConfigurationResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the server configuration' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Server-01', description: 'Name of the server' })
  @Expose()
  serverName!: string;

  @ApiProperty({ example: '192.168.1.1', description: 'IP address of the server' })
  @Expose()
  ipAddress!: string;

  @ApiProperty({
    example: 'mysql',
    description: 'Type of database driver for the server configuration',
    enum: ['mysql', 'postgres', 'mssql', 'sqlite', 'mariadb', 'oracle', 'mongodb', 'aurora-mysql', 'aurora-postgres'],
  })
  @Expose()
  driver!: string;

  @ApiProperty({
    example: 'Daily',
    description: 'Frequency for updates',
    enum: ['Daily', 'Weekly', 'Monthly'],
  })
  @Expose()
  updateFrequency!: string;

  @ApiProperty({ example: 30, description: 'Timeout duration in seconds' })
  @Expose()
  timeout!: number;

  @ApiProperty({ example: true, description: 'Whether the server configuration is enabled' })
  @Expose()
  isEnabled!: boolean;

  @ApiProperty({
    example: 'admin_user',
    description: 'User associated with the server configuration (optional)',
  })
  @Expose()
  user?: string;

  @ApiProperty({
    description: 'Password for the user (stored as a binary hash, displayed as hexadecimal)',
    example: '4a656665', // Example hexadecimal representation of binary data
  })
  @Transform(({ value }) => (value ? value.toString('hex') : null), { toPlainOnly: true })
  password?: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Last time the server ran' })
  @Expose()
  lastRunTime?: Date | null;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', description: 'Next scheduled runtime' })
  @Expose()
  nextRunTime?: Date | null;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', description: 'Created at' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', description: 'Updated at' })
  @Expose()
  updatedAt!: Date;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', description: 'Deleted at' })
  @Expose()
  deletedAt?: Date | null;

  @ApiProperty({
    description: 'List of databases related to the record',
    type: [DatabaseResponseDto],
  })
  @Expose()
  databases?: DatabaseResponseDto[];
}
