// model/recommendation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('recommendation', { schema: getSchemaName('model') })
export class Recommendation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'recommendation_id' })
  id!: number;

  @Column({ type: 'text', name: 'summary' })
  summary!: string;

  @Column({ type: 'text', name: 'detailed_explanation' })
  detailedExplanation!: string;

  @Column({ type: 'text', name: 'implementation_plan' })
  implementationPlan!: string;

  @Column({ type: 'text', name: 'impact' })
  impact!: string;

  @Column({ type: 'varchar', length: 50, name: 'status' })
  status!: string;

  @Column({ type: 'varchar', length: 255, name: 'created_by' })
  createdBy!: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'last_modified_at' })
  lastModifiedAt!: Date;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'tables_impacted' })
  tablesImpacted!: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'queries_impacted' })
  queriesImpacted!: string;
}
