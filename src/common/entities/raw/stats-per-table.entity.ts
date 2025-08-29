// raw/stats_per_table.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('stats_per_table', { schema: getSchemaName('raw') })
export class StatsPerTable extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'stats_per_table_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'TableName' })
  tableName!: string;

  @Column({ type: 'int', name: 'IndexCount', nullable: true })
  indexCount?: number;

  @Column({ type: 'nvarchar', length: 4000, name: 'IndexNames', nullable: true })
  indexNames?: string;

  @Column({ type: 'bigint', name: 'NumberOfRows', nullable: true })
  numberOfRows?: number;

  @Column({ type: 'varchar', length: 25, name: 'SimilarKeyStatus' })
  similarKeyStatus!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseName', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
