// raw/execplan.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('execplan', { schema: getSchemaName('raw') })
export class ExecPlan extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'execplan_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'SQLText', nullable: true })
  sqlText?: string;

  @Column({ type: 'binary', length: 8, name: 'QueryHash', nullable: true })
  queryHash?: Buffer;

  @Column({ type: 'datetime', name: 'creation_time', nullable: true })
  creationTime?: Date;

  @Column({ type: 'int', name: 'NodeId', nullable: true })
  nodeId?: number;

  @Column({ type: 'nvarchar', length: 50, name: 'PhysicalOp', nullable: true })
  physicalOp?: string;

  @Column({ type: 'nvarchar', length: 50, name: 'LogicalOp', nullable: true })
  logicalOp?: string;

  @Column({ type: 'float', name: 'EstimatedTotalSubtreeCost', nullable: true })
  estimatedTotalSubtreeCost?: number;

  @Column({ type: 'float', name: 'EstimatedRows', nullable: true })
  estimatedRows?: number;

  @Column({ type: 'float', name: 'EstimatedIO', nullable: true })
  estimatedIO?: number;

  @Column({ type: 'float', name: 'EstimatedCPU', nullable: true })
  estimatedCPU?: number;

  @Column({ type: 'bit', name: 'Parallel', nullable: true })
  parallel?: boolean;

  @Column({ type: 'float', name: 'EstimateRebinds', nullable: true })
  estimateRebinds?: number;

  @Column({ type: 'float', name: 'EstimateRewinds', nullable: true })
  estimateRewinds?: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseNam', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
