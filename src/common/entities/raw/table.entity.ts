// raw/table.entity.ts
import { Entity, Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Index as IndexTable } from './index.entity';

@Entity('table', { schema: getSchemaName('raw') })
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'table_id' })
  id!: number;

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

  @Column({ type: 'bigint', name: 'total_writes', nullable: true })
  totalWrites?: number;

  @Column({ type: 'bigint', name: 'total_updates', nullable: true })
  totalUpdates?: number;

  @Column({ type: 'bigint', name: 'total_reads', nullable: true })
  totalReads?: number;

  @Column({ type: 'bigint', name: 'total_scans', nullable: true })
  totalScans?: number;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;

  // One-to-many relationship with Index entity
  @OneToMany(() => IndexTable, (indexTable) => indexTable.table)
  indexes!: IndexTable[];
}
