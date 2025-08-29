// role.entity.ts
import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('role', { schema: getSchemaName('app') })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('nvarchar', { length: 255 })
  @Expose()
  name!: string;

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions!: Permission[];
}
