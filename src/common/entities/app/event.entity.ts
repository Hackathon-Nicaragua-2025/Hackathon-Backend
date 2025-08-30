import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Location } from './location.entity';
import { Reserve } from './reserve.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { EventTicket } from './event-ticket.entity';

@Entity('events', { schema: 'app' })
export class Event {
  @PrimaryGeneratedColumn('uuid', { name: 'event_id' })
  eventId!: string;

  @Column('varchar', { length: 300, name: 'title' })
  title!: string;

  @Column('text', { nullable: true, name: 'description' })
  description!: string | null;

  @Column('uuid', { nullable: true, name: 'location_id' })
  locationId!: string | null;

  @Column('uuid', { nullable: true, name: 'reserve_id' })
  reserveId!: string | null;

  @Column('uuid', { nullable: true, name: 'organizer_id' })
  organizerId!: string | null;

  @Column('timestamptz', { name: 'start_date' })
  startDate!: Date;

  @Column('timestamptz', { name: 'end_date' })
  endDate!: Date;

  @Column('int', { nullable: true, name: 'max_participants' })
  maxParticipants!: number | null;

  @Column('int', { default: 0, name: 'current_participants' })
  currentParticipants!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, name: 'price' })
  price!: number;

  @Column('varchar', { length: 50, nullable: true, name: 'event_type' })
  eventType!: string | null; // 'workshop', 'tour', 'festival', 'conference'

  @Column('varchar', { length: 20, nullable: true, name: 'difficulty_level' })
  difficultyLevel!: string | null; // 'beginner', 'intermediate', 'advanced'

  @Column('text', { nullable: true, name: 'requirements' })
  requirements!: string | null;

  @Column('boolean', { default: false, name: 'is_published' })
  isPublished!: boolean;

  @Column('boolean', { default: false, name: 'is_cancelled' })
  isCancelled!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => Location, (location) => location.events)
  @JoinColumn({ name: 'location_id' })
  location!: Location | null;

  @ManyToOne(() => Reserve, (reserve) => reserve.events)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve | null;

  @ManyToOne(() => User, (user) => user.organizedEvents)
  @JoinColumn({ name: 'organizer_id' })
  organizer!: User | null;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings!: Booking[];

  @OneToMany(() => EventTicket, (eventTicket) => eventTicket.event)
  eventTickets!: EventTicket[];
}
