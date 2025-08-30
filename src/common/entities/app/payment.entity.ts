import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('payments', { schema: 'app' })
export class Payment {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_id' })
  paymentId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('uuid', { nullable: true, name: 'booking_id' })
  bookingId!: string | null;

  @Column('decimal', { precision: 10, scale: 2, name: 'amount' })
  amount!: number;

  @Column('varchar', { length: 50, name: 'currency' })
  currency!: string; // 'USD', 'NIO', etc.

  @Column('varchar', { length: 50, name: 'payment_method' })
  paymentMethod!: string; // 'credit_card', 'debit_card', 'cash', 'transfer'

  @Column('varchar', { length: 50, name: 'status' })
  status!: string; // 'pending', 'completed', 'failed', 'refunded'

  @Column('varchar', { length: 200, nullable: true, name: 'transaction_id' })
  transactionId!: string | null;

  @Column('text', { nullable: true, name: 'description' })
  description!: string | null;

  @Column('jsonb', { nullable: true, name: 'metadata' })
  metadata!: any | null; // Información adicional del pago

  @Column('timestamptz', { nullable: true, name: 'processed_at' })
  processedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Booking, (booking) => booking.payments)
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking | null;
}
