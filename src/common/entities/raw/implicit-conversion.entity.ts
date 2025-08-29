// raw/implicit-conversion.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('implicit_conversion', { schema: getSchemaName('raw') })
export class ImplicitConversion extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'implicit_conversion_id' })
  id!: number;

  @Column({ type: 'varchar', length: 4000, name: 'sql_text', nullable: true })
  sqlText?: string;

  @Column({ type: 'int', name: 'statement_id', nullable: true })
  statementId?: number;

  @Column({ type: 'varchar', length: 4000, name: 'expression', nullable: true })
  expression?: string;

  @Column({ type: 'int', name: 'usecounts' })
  useCounts!: number;

  @Column({ type: 'xml', name: 'query_plan', nullable: true })
  queryPlan?: string;

  @Column({ type: 'varchar', length: 100, name: 'query_hash', nullable: true })
  queryHash?: string;

  @Column({ type: 'varchar', length: 100, name: 'query_plan_hash', nullable: true })
  queryPlanHash?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'statement_subtree_cost', nullable: true })
  statementSubtreeCost?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'estimated_total_subtree_cost', nullable: true })
  estimatedTotalSubtreeCost?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'statement_optm_early_abort_reason', nullable: true })
  statementOptmEarlyAbortReason?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'statement_optm_level', nullable: true })
  statementOptmLevel?: string;

  @Column({ type: 'varbinary', length: 64, name: 'plan_handle' })
  planHandle!: Buffer;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
