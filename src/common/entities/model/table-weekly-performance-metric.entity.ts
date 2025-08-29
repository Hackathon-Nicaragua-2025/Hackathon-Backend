// model/table_weekly_performance_metric.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('table_weekly_performance_metric', { schema: getSchemaName('model') })
export class TableWeeklyPerformanceMetric extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'table_weekly_performance_metric_id' })
  id!: number;

  @Column({ type: 'int', name: 'table_id' })
  tableId!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'bigint', name: 'row_count', nullable: true })
  rowCount?: number;

  @Column({ type: 'bigint', name: 'size_mb', nullable: true })
  sizeMb?: number;

  @Column({ type: 'bigint', name: 'total_reads', nullable: true })
  totalReads?: number;

  @Column({ type: 'bigint', name: 'total_writes', nullable: true })
  totalWrites?: number;

  @Column({ type: 'bigint', name: 'total_updates', nullable: true })
  totalUpdates?: number;

  @Column({ type: 'bigint', name: 'total_scans', nullable: true })
  totalScans?: number;

  @Column({ type: 'date', name: 'week_end_date', nullable: true })
  weekEndDate?: Date;

  @Column({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;
}
