// raw/constraint.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('constraint', { schema: getSchemaName('raw') })
export class Constraint extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'constraint_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 128, name: 'constraint_name' })
  constraintName!: string;

  @Column({ type: 'nvarchar', length: 60, name: 'constraint_type', nullable: true })
  constraintType?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseNam', nullable: true })
  databaseName?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
