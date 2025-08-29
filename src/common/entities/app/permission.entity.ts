import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('Permissions', { schema: 'app' })
export class Permission {
  @PrimaryGeneratedColumn({ name: 'PermissionId', type: 'int' })
  permissionId!: number;

  @Column('nvarchar', { length: 100, name: 'Name' })
  name!: string;

  @Column('nvarchar', { length: 250, nullable: true, name: 'Description' })
  description!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}
