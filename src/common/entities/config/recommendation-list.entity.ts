// config/recommendation-list.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('recommendation_list', { schema: getSchemaName('config') })
export class RecommendationList extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'recommendation_id', type: 'int' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'recommendation_title' })
  recommendationTitle!: string;

  @Column({ type: 'text', name: 'recommendation_definition' })
  recommendationDefinition!: string;

  @Column({ type: 'nvarchar', length: 50, name: 'recommendation_type' })
  recommendationType!: string;
}
