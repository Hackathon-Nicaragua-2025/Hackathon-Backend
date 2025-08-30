import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('LoginAudits', { schema: 'app' })
export class LoginAudit {
  @PrimaryGeneratedColumn('uuid', { name: 'AuditId' })
  auditId!: string;

  @Column('uuid', { nullable: true, name: 'UserId' })
  userId!: string | null;

  @Column('varchar', { length: 100, name: 'Event' })
  event!: string; // 'login_success' | 'login_failed' | 'refresh' | 'logout'

  @Column('varchar', { length: 100, nullable: true, name: 'IpAddress' })
  ipAddress!: string | null;

  @Column('varchar', { length: 500, nullable: true, name: 'UserAgent' })
  userAgent!: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.loginAudits, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'UserId' })
  user!: User | null;
}
