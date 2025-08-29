// model/query_weekly_performance_metric.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('query_weekly_performance_metric', { schema: getSchemaName('model') })
export class QueryWeeklyPerformanceMetric extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'query_weekly_performance_metric_id' })
  id!: number;

  @Column({ type: 'int', name: 'query_id', nullable: true })
  queryId?: Buffer;

  @Column({ type: 'binary', length: 8, name: 'query_hash', nullable: true })
  queryHash?: Buffer;

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

  @Column({ type: 'date', name: 'week_end_date', nullable: true })
  weekEndDate?: string;

  @Column({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;
}
