import { CreateDateColumn, UpdateDateColumn, Column, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base-entity.entity';

export abstract class BaseAuditEntity extends BaseEntity {
  @CreateDateColumn({ type: 'datetime', nullable: true, name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'created_by' })
  createdBy?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'updated_by' })
  updatedBy?: string;
}

export interface IBaseAuditEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
}
