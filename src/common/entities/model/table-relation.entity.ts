// raw/table-relation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Table } from './table.entity';

@Entity('table-relation', { schema: getSchemaName('model') })
export class TableRelation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'relation_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'foreign_key_name' })
  foreignKeyName!: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_date' })
  ingestedDate!: Date;

  // Many-to-one relationship with Table entity
  @ManyToOne(() => Table, (db) => db.parentTableRelations)
  @JoinColumn()
  parentTable: Table | undefined;

  // Many-to-one relationship with Table entity
  @ManyToOne(() => Table, (db) => db.referencedTableRelations)
  @JoinColumn()
  referencedTable: Table | undefined;
}
