import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { Guide } from './guide.entity';
import { Reserve } from './reserve.entity';
import { BookingParticipant } from './booking-participant.entity';
import { BookingHistory } from './booking-history.entity';
import { Payment } from './payment.entity';
import { Review } from './review.entity';

@Entity('bookings', { schema: 'app' })
export class Booking {
  @PrimaryGeneratedColumn('uuid', { name: 'booking_id' })
  bookingId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('uuid', { nullable: true, name: 'event_id' })
  eventId!: string | null;

  @Column('uuid', { nullable: true, name: 'guide_id' })
  guideId!: string | null;

  @Column('uuid', { nullable: true, name: 'reserve_id' })
  reserveId!: string | null;

  @Column('date', { name: 'booking_date' })
  bookingDate!: Date;

  @Column('time', { nullable: true, name: 'start_time' })
  startTime!: string | null;

  @Column('time', { nullable: true, name: 'end_time' })
  endTime!: string | null;

  @Column('int', { default: 1, name: 'participants_count' })
  participantsCount!: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount!: number;

  @Column('varchar', { length: 50, default: 'pending', name: 'status' })
  status!: string; // 'pending', 'confirmed', 'cancelled', 'completed'

  @Column('text', { nullable: true, name: 'special_requirements' })
  specialRequirements!: string | null;

  @Column('text', { nullable: true, name: 'notes' })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: 'event_id' })
  event!: Event | null;

  @ManyToOne(() => Guide, (guide) => guide.bookings)
  @JoinColumn({ name: 'guide_id' })
  guide!: Guide | null;

  @ManyToOne(() => Reserve, (reserve) => reserve.bookings)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve | null;

  @OneToMany(() => BookingParticipant, (participant) => participant.booking)
  participants!: BookingParticipant[];

  @OneToMany(() => BookingHistory, (history) => history.booking)
  history!: BookingHistory[];

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments!: Payment[];

  @OneToMany(() => Review, (review) => review.booking)
  reviews!: Review[];
}
