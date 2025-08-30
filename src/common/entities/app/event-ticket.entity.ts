import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('event_tickets', { schema: 'app' })
export class EventTicket {
  @PrimaryGeneratedColumn('uuid', { name: 'ticket_id' })
  ticketId!: string;

  @Column('uuid', { name: 'event_id' })
  eventId!: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0, name: 'price' })
  price!: number;

  @Column('int', { default: 0, name: 'quantity' })
  quantity!: number;

  @Column('int', { default: 0, name: 'sold' })
  sold!: number;

  // Relaciones
  @ManyToOne(() => Event, (event) => event.eventTickets)
  @JoinColumn({ name: 'event_id' })
  event!: Event;
}
