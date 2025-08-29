// aggmodel/aggregated_performance.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('aggregated_performance', { schema: getSchemaName('aggmodel') })
export class AggregatedPerformance extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'agg_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'query_hash' })
  queryHash!: string;

  @Column({ type: 'int', name: 'database_id' })
  databaseId!: number;

  @Column({ type: 'int', name: 'total_executions' })
  totalExecutions!: number;

  @Column({ type: 'float', name: 'avg_cpu_time_ms' })
  avgCpuTimeMs!: number;

  @Column({ type: 'float', name: 'avg_elapsed_time_ms' })
  avgElapsedTimeMs!: number;

  @Column({ type: 'float', name: 'avg_logical_reads' })
  avgLogicalReads!: number;

  @Column({ type: 'float', name: 'avg_logical_writes' })
  avgLogicalWrites!: number;

  @Column({ type: 'float', name: 'avg_physical_reads' })
  avgPhysicalReads!: number;

  @Column({ type: 'float', name: 'avg_index_seeks' })
  avgIndexSeeks!: number;

  @Column({ type: 'float', name: 'avg_table_scans' })
  avgTableScans!: number;

  @CreateDateColumn({ type: 'date', name: 'week_end_date' })
  weekEndDate!: Date;
}
