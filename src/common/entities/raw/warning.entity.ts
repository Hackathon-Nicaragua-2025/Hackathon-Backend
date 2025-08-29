// raw/warning.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('warning', { schema: getSchemaName('raw') })
export class Warning extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'warning_id' })
  id!: number;

  @Column({ type: 'varchar', length: 4000, name: 'sql_text', nullable: true })
  sqlText?: string;

  @Column({ type: 'int', name: 'StatementId', nullable: true })
  statementId?: number;

  @Column({ type: 'int', name: 'node_id', nullable: true })
  nodeId?: number;

  @Column({ type: 'nvarchar', length: 128, name: 'physical_op', nullable: true })
  physicalOp?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'logical_op', nullable: true })
  logicalOp?: string;

  @Column({ type: 'nvarchar', length: 141, name: 'warning', nullable: true })
  warning?: string;

  @Column({ type: 'nvarchar', length: 20, name: 'objtype' })
  objType!: string;

  @Column({ type: 'int', name: 'usecounts' })
  useCounts!: number;

  @Column({ type: 'xml', name: 'query_plan', nullable: true })
  queryPlan?: string;

  @Column({ type: 'varchar', length: 100, name: 'query_hash', nullable: true })
  queryHash?: string;

  @Column({ type: 'varchar', length: 100, name: 'query_plan_hash', nullable: true })
  queryPlanHash?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'StatementSubTreeCost', nullable: true })
  statementSubTreeCost?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'EstimatedTotalSubtreeCost', nullable: true })
  estimatedTotalSubtreeCost?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'StatementOptmEarlyAbortReason', nullable: true })
  statementOptmEarlyAbortReason?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'StatementOptmLevel', nullable: true })
  statementOptmLevel?: string;

  @Column({ type: 'varbinary', length: 64, name: 'plan_handle' })
  planHandle!: Buffer;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseNam', nullable: true })
  databaseNam?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
