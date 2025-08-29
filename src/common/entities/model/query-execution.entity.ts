// model/query_execution.entity.ts
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { Query } from './query.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('query_execution', { schema: getSchemaName('model') })
export class QueryExecution extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'query_execution_id', type: 'int' })
  id!: number;

  @Column({ name: 'query_id' })
  queryId!: number;

  @Column({ type: 'binary', length: 8, name: 'query_hash' })
  queryHash!: Buffer;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @Column({ type: 'datetime', name: 'creation_time', nullable: true })
  creationTime?: Date;

  @Column({ type: 'datetime', name: 'last_execution_time', nullable: true })
  lastExecutionTime?: Date;

  @Column({ type: 'bigint', name: 'execution_count', nullable: true })
  executionCount?: number;

  @Column({ type: 'bigint', name: 'cpu_time', nullable: true })
  cpuTime?: number;

  @Column({ type: 'bigint', name: 'elapsed_time', nullable: true })
  elapsedTime?: number;

  @Column({ type: 'bigint', name: 'logical_reads', nullable: true })
  logicalReads?: number;

  @Column({ type: 'bigint', name: 'logical_writes', nullable: true })
  logicalWrites?: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name' })
  serverName!: string;

  @Column({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;

  // Many-to-one relationship with the Query entity
  @ManyToOne(() => Query, (query) => query.queryExecution)
  query!: Query;
}
