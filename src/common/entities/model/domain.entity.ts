// model/domain.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { Application } from './application.entity';

@Entity('domain', { schema: getSchemaName('model') })
export class Domain extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'domain_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'domain_name' })
  domainName!: string;

  @Column('bit', { default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_date' })
  ingestedDate!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;

  // One-to-many relationship with Domain entity
  @OneToMany(() => Application, (application) => application.domain)
  applications!: Application[];
}
