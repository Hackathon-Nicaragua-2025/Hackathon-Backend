// raw/dmv.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('dmv', { schema: getSchemaName('raw') })
export class DMV extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'dmv_id' })
  id!: number;

  @Column({ type: 'varbinary', length: 64, name: 'plan_handle' })
  planHandle!: Buffer;

  @Column({ type: 'varbinary', length: 64, name: 'sql_handle' })
  sqlHandle!: Buffer;

  @Column({ type: 'bigint', name: 'execution_count' })
  executionCount!: number;

  @Column({ type: 'bigint', name: 'total_logical_reads' })
  totalLogicalReads!: number;

  @Column({ type: 'bigint', name: 'total_logical_writes' })
  totalLogicalWrites!: number;

  @Column({ type: 'bigint', name: 'total_worker_time' })
  totalWorkerTime!: number;

  @Column({ type: 'bigint', name: 'total_elapsed_time' })
  totalElapsedTime!: number;

  @Column({ type: 'datetime', name: 'creation_time', nullable: true })
  creationTime?: Date;

  @Column({ type: 'datetime', name: 'last_execution_time', nullable: true })
  lastExecutionTime?: Date;

  @Column({ type: 'binary', length: 8, name: 'query_hash', nullable: true })
  queryHash?: Buffer;

  @Column({ type: 'binary', length: 8, name: 'query_plan_hash', nullable: true })
  queryPlanHash?: Buffer;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'statement_text', nullable: true })
  statementText?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
