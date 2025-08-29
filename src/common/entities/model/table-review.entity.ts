// model/table_review.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('table_review', { schema: getSchemaName('model') })
export class TableReview extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'table_review_id' })
  id!: number;

  @Column({ type: 'int', name: 'table_id' })
  tableId!: number;

  @Column({ type: 'varchar', length: 255, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'date', name: 'week' })
  week!: Date;

  @Column({ type: 'int', name: 'row_count', nullable: true })
  rowCount?: number;

  @Column({ type: 'float', name: 'size_mb', nullable: true })
  sizeMb?: number;

  @Column({ type: 'bigint', name: 'reads', nullable: true })
  reads?: number;

  @Column({ type: 'bigint', name: 'scans', nullable: true })
  scans?: number;

  @Column({ type: 'bigint', name: 'seeks', nullable: true })
  seeks?: number;

  @Column({ type: 'bigint', name: 'writes', nullable: true })
  writes?: number;

  @Column({ type: 'bigint', name: 'updates', nullable: true })
  updates?: number;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'query_list', nullable: true })
  queryList?: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'indexes', nullable: true })
  indexes?: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'dependencies', nullable: true })
  dependencies?: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'recommendations', nullable: true })
  recommendations?: string;

  @Column({ type: 'datetime', name: 'last_run_time', nullable: true })
  lastRunTime?: Date;

  @Column({ type: 'datetime', name: 'next_run_time', nullable: true })
  nextRunTime?: Date;
}
