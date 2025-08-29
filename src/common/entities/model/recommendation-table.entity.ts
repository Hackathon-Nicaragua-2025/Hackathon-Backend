// model/recommendation_table.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Table } from './table.entity';

@Entity('recommendation_table', { schema: getSchemaName('model') })
export class RecommendationTable extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'recommendation_id' })
  id!: number;

  @Column({ type: 'text', name: 'summary', nullable: true })
  summary?: string;

  @Column({ type: 'text', name: 'detailed_explanation', nullable: true })
  detailedExplanation?: string;

  @Column({ type: 'text', name: 'implementation_plan', nullable: true })
  implementationPlan?: string;

  @Column({ type: 'text', name: 'impact', nullable: true })
  impact?: string;

  @Column({ type: 'varchar', length: 50, name: 'status', nullable: true })
  status?: string;

  @Column({ type: 'varchar', length: 255, name: 'created_by', nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', nullable: true })
  createdAt?: Date;

  @CreateDateColumn({ type: 'datetime', name: 'last_modified_at', nullable: true })
  lastModifiedAt?: Date;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'tables_impacted', nullable: true })
  tablesImpacted?: string;

  // Many-to-one relationship with Table entity
  @ManyToOne(() => Table, (table) => table.recommendations)
  table!: Table;
}
