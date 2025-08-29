// config/database-configuration.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { ServerConfiguration } from './server-configuration.entity';
import { Table } from '../model/table.entity';

@Entity('database_configuration', { schema: getSchemaName('config') })
export class DatabaseConfiguration extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'database_id', type: 'int' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name' })
  serverName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name' })
  databaseName!: string;

  @Column({ type: 'bit', name: 'is_enabled' })
  isEnabled!: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_date' })
  ingestedDate!: Date;

  // Many-to-one relationship with ServerConfiguration entity
  @ManyToOne(() => ServerConfiguration, (server) => server.databases)
  server: ServerConfiguration | undefined;

  // One-to-Many relationship with Table entity
  @OneToMany(() => Table, (table) => table.database)
  tables!: Table[];
}
