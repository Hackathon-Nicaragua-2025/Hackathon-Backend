import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('VerificationTokens', { schema: 'app' })
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid', { name: 'VerificationId' })
  verificationId!: string;

  @Column('uuid', { name: 'UserId' })
  userId!: string;

  @Column('varchar', { length: 500, name: 'TokenHash' })
  tokenHash!: string;

  @Column('varchar', { length: 50, name: 'Purpose' })
  purpose!: string; // 'email_verification' | 'password_reset'

  @Column('timestamptz', { name: 'ExpiresAt' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @Column('timestamptz', { nullable: true, name: 'UsedAt' })
  usedAt!: Date | null;

  @ManyToOne(() => User, (user) => user.verificationTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user!: User;
}
