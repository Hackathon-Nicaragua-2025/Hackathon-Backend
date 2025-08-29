import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExecPlanResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the execution plan record.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'SELECT * FROM users', description: 'SQL text of the execution plan.', nullable: true })
  @Expose()
  sqlText?: string;

  @ApiProperty({ example: 'QkFNRDEyMw==', description: 'Hash of the query in binary format.', nullable: true })
  @Expose()
  queryHash?: Buffer;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Time when the execution plan was created.',
    nullable: true,
  })
  @Expose()
  creationTime?: Date;

  @ApiProperty({ example: 1, description: 'Node ID in the execution plan.', nullable: true })
  @Expose()
  nodeId?: number;

  @ApiProperty({ example: 'Index Seek', description: 'Physical operation in the execution plan.', nullable: true })
  @Expose()
  physicalOp?: string;

  @ApiProperty({ example: 'Nested Loops', description: 'Logical operation in the execution plan.', nullable: true })
  @Expose()
  logicalOp?: string;

  @ApiProperty({ example: 5.25, description: 'Estimated total cost of the subtree.', nullable: true })
  @Expose()
  estimatedTotalSubtreeCost?: number;

  @ApiProperty({ example: 100, description: 'Estimated number of rows.', nullable: true })
  @Expose()
  estimatedRows?: number;

  @ApiProperty({ example: 0.1, description: 'Estimated I/O cost.', nullable: true })
  @Expose()
  estimatedIO?: number;

  @ApiProperty({ example: 0.05, description: 'Estimated CPU cost.', nullable: true })
  @Expose()
  estimatedCPU?: number;

  @ApiProperty({ example: true, description: 'Indicates if the operation is parallelized.', nullable: true })
  @Expose()
  parallel?: boolean;

  @ApiProperty({ example: 1, description: 'Estimated number of rebinds.', nullable: true })
  @Expose()
  estimateRebinds?: number;

  @ApiProperty({ example: 0, description: 'Estimated number of rewinds.', nullable: true })
  @Expose()
  estimateRewinds?: number;

  @ApiProperty({
    example: 'server01',
    description: 'Name of the server where the execution plan was run.',
    nullable: true,
  })
  @Expose()
  serverName?: string;

  @ApiProperty({
    example: 'TestDB',
    description: 'Name of the database where the execution plan was run.',
    nullable: true,
  })
  @Expose()
  databaseName?: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Timestamp when the record was ingested.' })
  @Expose()
  ingestedTimestamp!: Date;
}
