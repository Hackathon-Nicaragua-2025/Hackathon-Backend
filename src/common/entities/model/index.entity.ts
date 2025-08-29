// model/index.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Table } from './table.entity';

@Entity('index', { schema: getSchemaName('model') })
export class Index extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'index_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'schema_name' })
  schemaName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'index_name', nullable: true })
  indexName?: string;

  @Column({ type: 'nvarchar', length: 60, name: 'type_desc', nullable: true })
  indexTypeDesc?: string;

  @Column({ type: 'bigint', name: 'number_of_write', nullable: true })
  numberOfWrite?: number;

  @Column({ type: 'bigint', name: 'number_of_seeks', nullable: true })
  numberOfSeeks?: number;

  @Column({ type: 'bigint', name: 'number_of_scans', nullable: true })
  numberOfScans?: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingestion_timestamp' })
  ingestedTimestamp!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;

  // Many-to-one relationship with the Table entity
  @ManyToOne(() => Table, (table) => table.indexes)
  table!: Table;
}
