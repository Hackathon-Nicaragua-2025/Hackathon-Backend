import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('Permissions', { schema: 'app' })
export class Permission {
  @PrimaryGeneratedColumn({ name: 'PermissionId', type: 'int' })
  permissionId!: number;

  @Column('varchar', { length: 100, name: 'Name' })
  name!: string;

  @Column('varchar', { length: 250, nullable: true, name: 'Description' })
  description!: string;

  // Propiedad getter para compatibilidad
  get action(): string {
    return this.name;
  }

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}
