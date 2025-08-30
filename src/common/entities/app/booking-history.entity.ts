import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { User } from './user.entity';

@Entity('booking_history', { schema: 'app' })
export class BookingHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  historyId!: string;

  @Column('uuid', { name: 'booking_id' })
  bookingId!: string;

  @Column('varchar', { length: 50, nullable: true, name: 'old_status' })
  oldStatus!: string | null;

  @Column('varchar', { length: 50, name: 'new_status' })
  newStatus!: string;

  @Column('uuid', { nullable: true, name: 'changed_by' })
  changedBy!: string | null;

  @Column('varchar', { length: 500, nullable: true, name: 'note' })
  note!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relaciones
  @ManyToOne(() => Booking, (booking) => booking.history)
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking;

  @ManyToOne(() => User, (user) => user.bookingHistoryChanges)
  @JoinColumn({ name: 'changed_by' })
  changedByUser!: User | null;
}
