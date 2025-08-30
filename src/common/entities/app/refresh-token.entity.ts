import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('RefreshTokens', { schema: 'app' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid', { name: 'RefreshTokenId' })
  refreshTokenId!: string;

  @Column('uuid', { name: 'UserId' })
  userId!: string;

  @Column('varchar', { length: 500, name: 'TokenHash' })
  tokenHash!: string;

  @Column('timestamptz', { name: 'ExpiresAt' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @Column('timestamptz', { nullable: true, name: 'RevokedAt' })
  revokedAt!: Date | null;

  @Column('uuid', { nullable: true, name: 'ReplacedByToken' })
  replacedByToken!: string | null;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user!: User;
}
