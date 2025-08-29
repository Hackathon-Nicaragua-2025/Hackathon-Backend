// raw/missing_index.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('missing_index', { schema: getSchemaName('raw') })
export class MissingIndex extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'missing_index_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 128, name: 'database_name', nullable: true })
  databaseName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'schema_name', nullable: true })
  schemaName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'table_name', nullable: true })
  tableName?: string;

  @Column({ type: 'varchar', length: 4000, name: 'sql_text', nullable: true })
  sqlText?: string;

  @Column({ type: 'int', name: 'StatementId', nullable: true })
  statementId?: number;

  @Column({ type: 'int', name: 'usecounts' })
  usecounts!: number;

  @Column({ type: 'int', name: 'refcounts' })
  refcounts!: number;

  @Column({ type: 'float', name: 'impact', nullable: true })
  impact?: number;

  @Column({ type: 'varchar', length: 'MAX', name: 'equality_columns', nullable: true })
  equalityColumns?: string;

  @Column({ type: 'varchar', length: 'MAX', name: 'inequality_columns', nullable: true })
  inequalityColumns?: string;

  @Column({ type: 'varchar', length: 'MAX', name: 'include_columns', nullable: true })
  includeColumns?: string;

  @Column({ type: 'xml', name: 'query_plan', nullable: true })
  queryPlan?: string;

  @Column({ type: 'varbinary', length: 64, name: 'plan_handle' })
  planHandle!: Buffer;

  @Column({ type: 'nvarchar', length: 128, name: 'server_name', nullable: true })
  serverName?: string;

  @Column({ type: 'nvarchar', length: 128, name: 'DatabaseNam', nullable: true })
  databaseNam?: string;

  @CreateDateColumn({ type: 'datetime', name: 'ingested_timestamp' })
  ingestedTimestamp!: Date;
}
