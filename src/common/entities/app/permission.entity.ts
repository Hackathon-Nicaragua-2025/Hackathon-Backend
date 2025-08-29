import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Module } from './module.entity';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('permission', { schema: getSchemaName('app') }) // Represents different permissions in the system
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  // Action that this permission allows (e.g., 'CREATE_USER', 'VIEW_REPORTS')
  @Column('nvarchar', { length: 255 })
  action!: string;

  // Many-to-many relationship with roles that have this permission
  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];

  // Many-to-many relationship with modules that this permission applies to
  @ManyToMany(() => Module, (module) => module.permissions)
  @JoinTable() // Specifies that this is the owner side of the relation
  modules!: Module[];
}
