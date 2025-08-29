// raw/views.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('views', { schema: getSchemaName('raw') })
export class Views extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'view_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'view_name' })
  viewName!: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'view_definition', nullable: true })
  viewDefinition?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
