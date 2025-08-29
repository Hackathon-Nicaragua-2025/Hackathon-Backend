// model/application.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Domain } from './domain.entity';
import { Query } from './query.entity';

@Entity('application', { schema: getSchemaName('model') })
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'application_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'application_name' })
  applicationName!: string;

  @Column('bit', { default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_date' })
  ingestedDate!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;

  // Many-to-one relationship with Application entity
  @ManyToOne(() => Domain, (domain) => domain.applications)
  domain!: Domain;

  // One-to-many relationship with Query entity
  @OneToMany(() => Query, (query) => query.application)
  queries: Query[] | undefined;
}
