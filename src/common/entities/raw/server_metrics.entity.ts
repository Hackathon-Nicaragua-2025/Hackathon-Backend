// raw/server_metrics.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('server_metrics', { schema: getSchemaName('raw') })
export class ServerMetrics extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'server_metrics_id' })
  id!: number;

  @Column({ type: 'varchar', length: 'MAX', name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'bigint', name: 'query_count', nullable: true })
  queryCount?: number;

  @Column({ type: 'bigint', name: 'database_count', nullable: true })
  databaseCount?: number;

  @Column({ type: 'bigint', name: 'active_sessions', nullable: true })
  activeSessions?: number;

  @Column({ type: 'float', name: 'memory_usage_percent', nullable: true })
  memoryUsagePercent?: number;

  @Column({ type: 'bigint', name: 'total_disk_io', nullable: true })
  totalDiskIo?: number;

  @Column({ type: 'varchar', length: 'MAX', name: 'last_wait_type', nullable: true })
  lastWaitType?: string;

  @Column({ type: 'bigint', name: 'last_wait_time_ms', nullable: true })
  lastWaitTimeMs?: number;

  @Column({ type: 'bigint', name: 'last_cpu_time_ms', nullable: true })
  lastCpuTimeMs?: number;

  @Column({ type: 'datetime', name: 'ingested_timestamp', nullable: true })
  ingestedTimestamp?: Date;
}
