import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('refresh_token', { schema: getSchemaName('app') })
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('nvarchar', { name: 'refresh_token' })
  refreshToken!: string;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  user!: User;
}
