import {
  Entity,
  Column,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RefreshToken } from './refresh-token.entity';
import { BaseEntity } from '../base-entity.entity';
import { Role } from './role.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('user', { schema: getSchemaName('app') })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('nvarchar', { length: 255, name: 'first_name' })
  firstName!: string;

  @Column('nvarchar', { length: 255, name: 'last_name' })
  lastName!: string;

  @Column('int', { nullable: true })
  age!: number;

  @Column('nvarchar', { length: 255, unique: true })
  email!: string;

  @Column('nvarchar', { length: 255 })
  @Exclude()
  password!: string;

  @Column('bit', { default: true, name: 'is_active' })
  isActive!: boolean;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles!: Role[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  @JoinColumn()
  refreshToken!: RefreshToken;
}
