// raw/foreign-keys.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('foreign_keys', { schema: getSchemaName('raw') })
export class ForeignKeys extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'foreign_key_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'foreign_key_name' })
  foreignKeyName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'parent_table' })
  parentTable!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'parent_column', nullable: true })
  parentColumn?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'referenced_table' })
  referencedTable!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'referenced_column', nullable: true })
  referencedColumn?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseNam', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
