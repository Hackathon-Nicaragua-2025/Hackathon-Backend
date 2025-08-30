// role.entity.ts
import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('Roles', { schema: 'app' })
export class Role {
  @PrimaryGeneratedColumn({ name: 'RoleId', type: 'int' })
  roleId!: number;

  @Column('varchar', { length: 50, name: 'Name' })
  @Expose()
  name!: string;

  @Column('varchar', { length: 250, nullable: true, name: 'Description' })
  description!: string;

  @Column('boolean', { default: false, name: 'IsSystem' })
  isSystem!: boolean;

  // Propiedad getter para compatibilidad
  get id(): number {
    return this.roleId;
  }

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'RolePermissions',
    schema: 'app',
    joinColumn: {
      name: 'RoleId',
      referencedColumnName: 'roleId',
    },
    inverseJoinColumn: {
      name: 'PermissionId',
      referencedColumnName: 'permissionId',
    },
  })
  permissions!: Permission[];
}
