// model/query_parsed.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('query_parsed', { schema: getSchemaName('model') })
export class QueryParsed extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'query_parsed_id' })
  id!: number;

  @Column({ type: 'int', name: 'query_id' })
  queryId!: number;

  @Column({ type: 'nvarchar', length: 50, name: 'element_type' })
  elementType!: string;

  @Column({ type: 'nvarchar', length: 'MAX', name: 'element_value' })
  elementValue!: string;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;
}
