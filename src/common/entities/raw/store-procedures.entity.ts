// raw/store_procedures.entity.ts
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('store_procedures', { schema: getSchemaName('raw') })
export class StoreProcedures extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'store_procedure_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'procedure_name' })
  procedureName!: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'procedure_definition', nullable: true })
  procedureDefinition?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseNam', nullable: true })
  databaseNam?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
