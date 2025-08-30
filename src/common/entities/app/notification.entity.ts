import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications', { schema: 'app' })
export class Notification {
  @PrimaryGeneratedColumn('uuid', { name: 'notification_id' })
  notificationId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('varchar', { length: 200, name: 'title' })
  title!: string;

  @Column('text', { name: 'message' })
  message!: string;

  @Column('varchar', { length: 50, nullable: true, name: 'type' })
  type!: string | null; // 'booking', 'sighting', 'event', 'system'

  @Column('boolean', { default: false, name: 'is_read' })
  isRead!: boolean;

  @Column('timestamptz', { nullable: true, name: 'read_at' })
  readAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
