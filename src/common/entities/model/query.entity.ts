// model/query.entity.ts
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RecommendationQuery } from './query-recommendation.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { QueryExecution } from './query-execution.entity';
import { Application } from './application.entity';
import { Table } from './table.entity';

@Entity('query', { schema: getSchemaName('model') })
export class Query extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'query_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @Column({ type: 'nvarchar', length: 50, name: 'short_description', nullable: true })
  shortDescription?: string;

  @Column({ type: 'nvarchar', length: 250, name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'statement_text', nullable: true })
  statementText?: string;

  @Column({ type: 'binary', length: 8, name: 'query_hash', nullable: true })
  queryHash?: Buffer;

  @Column({ type: 'bigint', name: 'avg_logical_reads', nullable: true })
  avgLogicalReads?: number;

  @Column({ type: 'bigint', name: 'avg_logical_writes', nullable: true })
  avgLogicalWrites?: number;

  @Column({ type: 'bigint', name: 'avg_worker_time', nullable: true })
  avgWorkerTime?: number;

  @Column({ type: 'bigint', name: 'avg_elapsed_time', nullable: true })
  avgElapsedTime?: number;

  @Column({ type: 'int', name: 'execution_count', nullable: true })
  executionCount?: number;

  @Column({ type: 'datetime', name: 'last_execution_time', nullable: true })
  lastExecutionTime?: Date;

  @Column({ type: 'datetime', name: 'ingestion_timestamp', nullable: true })
  ingestionTimestamp?: Date;

  @Column({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;

  @OneToMany(() => RecommendationQuery, (recommendationQuery) => recommendationQuery.query)
  recommendations!: RecommendationQuery[];

  @OneToMany(() => QueryExecution, (queryExecution) => queryExecution.query)
  queryExecution!: QueryExecution[];

  // Many-to-one relationship with Application entity
  @ManyToOne(() => Application, (application) => application.queries)
  application: Application | undefined;

  // Many-to-Many relationship with Table entity
  @ManyToMany(() => Table, (table) => table.queries)
  @JoinTable()
  tables: Table[] | undefined;
}
