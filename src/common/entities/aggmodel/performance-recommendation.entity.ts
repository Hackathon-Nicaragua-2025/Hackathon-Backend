// aggmodel/performance_recommendation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('performance_recommendation', { schema: getSchemaName('aggmodel') })
export class PerformanceRecommendation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'rec_id' })
  id!: number;

  @Column({ type: 'int', name: 'agg_id' })
  aggId!: number;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'recommendation_text' })
  recommendationText!: string;

  @Column({ type: 'nvarchar', length: 100, name: 'recommendation_type' })
  recommendationType!: string;

  @Column({ type: 'nvarchar', length: 50, name: 'impact_estimation' })
  impactEstimation!: string;

  @Column({ type: 'nvarchar', length: 50, name: 'status' })
  status!: string;

  @CreateDateColumn({ type: 'date', name: 'implementation_date' })
  implementationDate!: Date;
}
