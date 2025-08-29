import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsOptional, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class AuditLogResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the audit log entry.' })
  @Expose()
  @IsInt({ message: 'ID must be an integer' })
  id!: number;

  @ApiProperty({
    example: 'ServerConfiguration',
    description: 'The type of entity that was modified (e.g., "ServerConfiguration").',
  })
  @Expose()
  @IsString({ message: 'Entity type must be a string' })
  @Length(1, 255, { message: 'Entity type must be between 1 and 255 characters' })
  entityType!: string;

  @ApiProperty({
    example: 42,
    description: 'The ID of the entity that was modified.',
  })
  @Expose()
  @IsInt({ message: 'Entity ID must be an integer' })
  entityId!: number;

  @ApiProperty({
    example: 'UPDATE',
    description: 'The action taken on the entity (e.g., "CREATE", "UPDATE", "DELETE").',
  })
  @Expose()
  @IsString({ message: 'Action type must be a string' })
  @Length(1, 255, { message: 'Action type must be between 1 and 255 characters' })
  actionType!: string;

  @ApiProperty({
    example: 'jdoe',
    description: 'The user who performed the action.',
  })
  @Expose()
  @IsString({ message: 'Action by must be a string' })
  @Length(1, 255, { message: 'Action by must be between 1 and 255 characters' })
  actionBy!: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The timestamp when the action was taken.',
    format: 'date-time',
  })
  @Expose()
  @IsDate({ message: 'Action at must be a valid date' })
  actionAt!: Date;

  @ApiProperty({
    example: '{"field": "old_value"}',
    description: 'The previous state of the entity for update or delete actions, stored as a JSON string.',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString({ message: 'Previous data must be a string' })
  previousData?: string;
}
