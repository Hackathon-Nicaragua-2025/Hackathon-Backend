// raw/stats_per_index.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('stats_per_index', { schema: getSchemaName('raw') })
export class StatsPerIndex extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'stats_per_index_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'SchemaName' })
  schemaName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'TableName' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'IndexName', nullable: true })
  indexName?: string;

  @Column({ type: 'nvarchar', length: 60, name: 'type_desc', nullable: true })
  typeDesc?: string;

  @Column({ type: 'bigint', name: 'NumberOfWrite', nullable: true })
  numberOfWrite?: number;

  @Column({ type: 'bigint', name: 'NumberOfSeeks', nullable: true })
  numberOfSeeks?: number;

  @Column({ type: 'bigint', name: 'NumberOfScans', nullable: true })
  numberOfScans?: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseName', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
