import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('module', { schema: getSchemaName('app') })
export class Module extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('nvarchar', { length: 255 })
  name!: string; // example: 'User Management', 'Reports', etc.

  @ManyToMany(() => Permission, (permission) => permission.modules)
  permissions!: Permission[];
}
