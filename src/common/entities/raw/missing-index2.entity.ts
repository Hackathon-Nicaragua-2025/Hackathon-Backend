// raw/missing_index2.entity.ts
import { Entity, Column, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('missing_index2', { schema: getSchemaName('raw') })
export class MissingIndex2 extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'missing_index2_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'base', nullable: true })
  base?: string;

  @Column({ type: 'nvarchar', length: 4000, name: 'ObjectName', nullable: true })
  objectName?: string;

  @Column({ type: 'datetime', name: 'LastUserSeek', nullable: true })
  lastUserSeek?: Date;

  @Column({ type: 'float', name: 'avg_user_impact', nullable: true })
  avgUserImpact?: number;

  @Column({ type: 'bigint', name: 'uso', nullable: true })
  uso?: number;

  @Column({ type: 'float', name: 'Impact', nullable: true })
  impact?: number;

  @Column({ type: 'nvarchar', length: 4000, name: 'CreateStatement', nullable: true })
  createStatement?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
