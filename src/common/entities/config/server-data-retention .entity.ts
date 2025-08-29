// config/server-data-retention.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { BaseAuditEntity, IBaseAuditEntity } from '../base-audit-entity.entity';

@Entity('server_data_retention', { schema: getSchemaName('config') })
export class ServerDataRetention extends BaseAuditEntity implements IBaseAuditEntity {
  @PrimaryGeneratedColumn({ name: 'server_data_retention_id', type: 'int' })
  id!: number;

  @Column({ name: 'server_id', type: 'int' })
  serverId!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'server_name', default: '' })
  serverName!: string;

  @Column({ type: 'int', name: 'retention_days', nullable: true })
  retentionDays?: number;
}
