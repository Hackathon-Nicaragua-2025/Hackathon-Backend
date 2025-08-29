// model/query_review.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('query_review', { schema: getSchemaName('model') })
export class QueryReview extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'query_review_id' })
  id!: number;

  @Column({ type: 'int', name: 'query_id' })
  queryId!: number;

  @Column({ type: 'text', name: 'query_text', nullable: true })
  queryText?: string;

  @Column({ type: 'varchar', length: 255, name: 'code_location', nullable: true })
  codeLocation?: string;

  @Column({ type: 'varchar', length: 50, name: 'status', nullable: true })
  status?: string;

  @Column({ type: 'varchar', length: 255, name: 'hash_key', nullable: true })
  hashKey?: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'performance_metrics', nullable: true })
  performanceMetrics?: string;

  @Column({ type: 'text', name: 'highlighted_text', nullable: true })
  highlightedText?: string;

  @Column({ type: 'int', name: 'recommendation_id', nullable: true })
  recommendationId?: number;
}
