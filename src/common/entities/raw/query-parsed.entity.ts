// raw/query_parsed.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('query_parsed', { schema: getSchemaName('raw') })
export class QueryParsed extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'query_parsed_id' })
  id!: number;

  @Column({ type: 'int', name: 'query_id', nullable: true })
  queryId?: number;

  @Column({ type: 'varchar', length: 'MAX', name: 'query_description', nullable: true })
  queryDescription?: string;
}
