// model/database.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('database', { schema: getSchemaName('model') })
export class Database extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'database_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name' })
  serverName!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
  name?: string;

  @CreateDateColumn({ type: 'datetime', name: 'creation_date' })
  creationDate!: Date;

  @Column({ type: 'int', name: 'db_id' })
  dbId!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name' })
  databaseName!: string;

  @Column({ type: 'int', name: 'compatibility_level', nullable: true })
  compatibilityLevel?: number;

  @Column({ type: 'varchar', length: 50, name: 'state_desc', nullable: true })
  stateDesc?: string;

  @CreateDateColumn({ type: 'datetime', name: 'db_creation_date' })
  dbCreationDate!: Date;

  @Column({ type: 'tinyint', name: 'db_compatibility_level' })
  dbCompatibilityLevel!: number;

  @Column({ type: 'float', name: 'total_size_mb', nullable: true })
  totalSizeMb?: number;

  @Column({ type: 'float', name: 'used_space_mb', nullable: true })
  usedSpaceMb?: number;

  @Column({ type: 'nvarchar', length: 60, name: 'db_state', nullable: true })
  dbState?: string;

  @Column({ type: 'nvarchar', length: 60, name: 'db_recovery_model', nullable: true })
  dbRecoveryModel?: string;

  @Column({ type: 'int', name: 'data_total_size_mb', nullable: true })
  dataTotalSizeMb?: number;

  @Column({ type: 'bigint', name: 'data_used_space_mb', nullable: true })
  dataUsedSpaceMb?: number;

  @Column({ type: 'int', name: 'log_total_size_mb', nullable: true })
  logTotalSizeMb?: number;

  @Column({ type: 'bigint', name: 'log_used_space_mb', nullable: true })
  logUsedSpaceMb?: number;

  @CreateDateColumn({ type: 'datetime', name: 'ingestion_timestamp' })
  ingestionTimestamp!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;
}
