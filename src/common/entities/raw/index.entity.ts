// raw/index.entity.ts
import { Entity, Column, CreateDateColumn, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Table } from './table.entity';

@Entity('index', { schema: getSchemaName('raw') })
export class Index extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'raw_index_id' })
  id!: number;

  @Column({ type: 'int', name: 'index_id' })
  indexId!: number;

  @Column({ type: 'int', name: 'object_id' })
  objectId!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'index_name', nullable: true })
  indexName?: string;

  @Column({ type: 'nvarchar', length: 60, name: 'index_type', nullable: true })
  indexType?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'column_name', nullable: true })
  columnName?: string;

  @Column({ type: 'bit', name: 'is_descending_key', nullable: true })
  isDescendingKey?: boolean;

  @Column({ type: 'bit', name: 'is_included_column', nullable: true })
  isIncludedColumn?: boolean;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;

  // Optional transformation timestamp
  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp', nullable: true })
  transformedTimestamp?: Date;

  // Many-to-one relationship with the Table entity
  @ManyToOne(() => Table, (table) => table.indexes)
  table!: Table;
}
