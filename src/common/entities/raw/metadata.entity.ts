// raw/metadata.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('metadata', { schema: getSchemaName('raw') })
export class Metadata extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'metadata_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'column_name', nullable: true })
  columnName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'data_type' })
  dataType!: string;

  @Column({ type: 'smallint', name: 'max_length' })
  maxLength!: number;

  @Column({ type: 'tinyint', name: 'precision' })
  precision!: number;

  @Column({ type: 'tinyint', name: 'scale' })
  scale!: number;

  @Column({ type: 'bit', name: 'is_nullable', nullable: true })
  isNullable?: boolean;

  @Column({ type: 'bit', name: 'is_identity' })
  isIdentity!: boolean;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
