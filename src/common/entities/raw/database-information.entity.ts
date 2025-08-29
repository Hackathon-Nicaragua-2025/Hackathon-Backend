// config/entities/raw/database-information.entity.ts
import { Entity, Column, CreateDateColumn, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('database_information', { schema: getSchemaName('raw') })
export class DatabaseInformation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'database_information_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @PrimaryColumn({ type: 'int', name: 'database_id' })
  databaseId!: number;

  @PrimaryColumn({ type: 'nvarchar', length: 128, name: 'name' })
  name!: string;

  @CreateDateColumn({ type: 'datetime', name: 'creation_date' })
  creationDate!: Date;

  @Column({ type: 'tinyint', name: 'compatibility_level' })
  compatibilityLevel!: number;

  @Column({ type: 'nvarchar', length: 60, name: 'state_desc', nullable: true })
  stateDesc?: string;

  @Column({ type: 'nvarchar', length: 60, name: 'RecoveryModel', nullable: true })
  recoveryModel?: string;

  @Column({ type: 'int', name: 'data_total_size_mb', nullable: true })
  dataTotalSizeMb?: number;

  @Column({ type: 'bigint', name: 'data_used_space_mb', nullable: true })
  dataUsedSpaceMb?: number;

  @Column({ type: 'int', name: 'log_total_size_mb', nullable: true })
  logTotalSizeMb?: number;

  @Column({ type: 'bigint', name: 'log_used_space_mb', nullable: true })
  logUsedSpaceMb?: number;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
