// config/server-configuration.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseAuditEntity, IBaseAuditEntity } from '../base-audit-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { DatabaseConfiguration } from './database-configuration.entity';

@Entity('server_configuration', { schema: getSchemaName('config') })
export class ServerConfiguration extends BaseAuditEntity implements IBaseAuditEntity {
  @PrimaryGeneratedColumn({ name: 'server_id', type: 'int' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'server_name', default: '' })
  serverName!: string;

  @Column({ type: 'nvarchar', length: 255, name: 'ip_address', default: '' })
  ipAddress!: string;

  @Column({ type: 'nvarchar', length: 155, name: 'driver', default: '', nullable: true })
  driver?: string;

  @Column({ type: 'varchar', length: 50, name: 'update_frequency' })
  updateFrequency!: string;

  @Column({ type: 'int', name: 'timeout' })
  timeout!: number;

  @Column({ type: 'bit', name: 'is_enabled' })
  isEnabled!: boolean;

  @Column({ type: 'nvarchar', length: 255, name: 'user', nullable: true })
  user?: string;

  @Column({ type: 'varbinary', length: 255, name: 'password', nullable: true })
  password?: Buffer;

  @Column({ type: 'datetime', name: 'last_run_time', nullable: true })
  lastRunTime?: Date;

  @Column({ type: 'datetime', name: 'next_run_time', nullable: true })
  nextRunTime?: Date;

  // One-to-Many relationship with DatabaseConfiguration entity
  @OneToMany(() => DatabaseConfiguration, (db) => db.server)
  databases!: DatabaseConfiguration[];
}
