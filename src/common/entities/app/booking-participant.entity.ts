import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('booking_participants', { schema: 'app' })
export class BookingParticipant {
  @PrimaryGeneratedColumn('uuid', { name: 'participant_id' })
  participantId!: string;

  @Column('uuid', { name: 'booking_id' })
  bookingId!: string;

  @Column('varchar', { length: 200, nullable: true, name: 'nombre' })
  nombre!: string | null;

  @Column('int', { nullable: true, name: 'edad' })
  edad!: number | null;

  @Column('varchar', { length: 500, nullable: true, name: 'nota' })
  nota!: string | null;

  // Relaciones
  @ManyToOne(() => Booking, (booking) => booking.participants)
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking;
}
