// model/index_weekly_performance_metric.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('index_weekly_performance_metric', { schema: getSchemaName('model') })
export class IndexWeeklyPerformanceMetric extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'index_weekly_performance_metric_id' })
  id!: number;

  @Column({ type: 'int', name: 'index_id', nullable: true })
  indexId?: string;

  @Column({ type: 'date', name: 'week_end_date', nullable: true })
  weekEndDate?: Date;

  @Column({ type: 'nvarchar', length: 128, name: 'index_name', nullable: true })
  indexName?: string;

  @Column({ type: 'float', name: 'number_of_write', nullable: true })
  numberOfWrite?: number;

  @Column({ type: 'float', name: 'number_of_seeks', nullable: true })
  numberOfSeeks?: number;

  @Column({ type: 'float', name: 'number_of_scans', nullable: true })
  numberOfScans?: number;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;
}
