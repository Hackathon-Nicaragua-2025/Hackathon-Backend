// model/table.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';
import { RecommendationTable } from './recommendation-table.entity';
import { DatabaseConfiguration } from '../config/database-configuration.entity';
import { Query } from './query.entity';
import { Index } from './index.entity';
import { TableRelation } from './table-relation.entity';

@Entity('table', { schema: getSchemaName('model') })
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'table_id' })
  id!: number;

  @Column({ type: 'nvarchar', length: 255, name: 'table_name' })
  tableName!: string;

  @Column({ type: 'nvarchar', length: 255, name: 'database_name' })
  databaseName!: string;

  @Column({ type: 'nvarchar', length: 255, name: 'server_name' })
  serverName!: string;

  @Column({ type: 'bigint', name: 'row_count', nullable: true })
  rowCount?: number;

  @Column({ type: 'float', name: 'size_mb', nullable: true })
  sizeMb?: number;

  @Column({ type: 'bigint', name: 'total_reads', nullable: true })
  totalReads?: number;

  @Column({ type: 'bigint', name: 'total_writes', nullable: true })
  totalWrites?: number;

  @Column({ type: 'bigint', name: 'total_updates', nullable: true })
  totalUpdates?: number;

  @Column({ type: 'bigint', name: 'total_scans', nullable: true })
  totalScans?: number;

  @CreateDateColumn({ type: 'datetime', name: 'transformed_timestamp' })
  transformedTimestamp!: Date;

  // One-to-many relationship with RecommendationTable entity
  @OneToMany(() => RecommendationTable, (recommendationTable) => recommendationTable.table)
  recommendations!: RecommendationTable[];

  // Many-to-one relationship with DatabaseConfiguration entity
  @ManyToOne(() => DatabaseConfiguration, (db) => db.tables)
  database: DatabaseConfiguration | undefined;

  // Many-to-Many relationship with Query entity
  @ManyToMany(() => Query, (query) => query.tables)
  queries: Query[] | undefined;

  // One-to-many relationship with Index entity
  @OneToMany(() => Index, (index) => index.table)
  indexes!: Index[];

  // One-to-many relationship with TableRelation entity
  @OneToMany(() => TableRelation, (tableRelation) => tableRelation.parentTable)
  parentTableRelations!: TableRelation[];

  // One-to-many relationship with TableRelation entity
  @OneToMany(() => TableRelation, (tableRelation) => tableRelation.referencedTable)
  referencedTableRelations!: TableRelation[];
}
