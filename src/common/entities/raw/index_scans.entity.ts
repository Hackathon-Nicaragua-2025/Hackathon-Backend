// raw/index-scans.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('index_scans', { schema: getSchemaName('raw') })
export class IndexScans extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'index_scan_id' })
  id!: number;

  @Column({ type: 'varchar', length: 4000, name: 'sql_text', nullable: true })
  sqlText?: string;

  @Column({ type: 'int', name: 'statement_id', nullable: true })
  statementId?: number;

  @Column({ type: 'int', name: 'node_id', nullable: true })
  nodeId?: number;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'schema_name', nullable: true })
  schemaName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name', nullable: true })
  tableName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'physical_operator', nullable: true })
  physicalOperator?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'index_name', nullable: true })
  indexName?: string;

  @Column({ type: 'varchar', length: 4000, name: 'predicate', nullable: true })
  predicate?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'table_cardinality', nullable: true })
  tableCardinality?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'estimate_rows', nullable: true })
  estimateRows?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'avg_row_size', nullable: true })
  avgRowSize?: string;

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

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
