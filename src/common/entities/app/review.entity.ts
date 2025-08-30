import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { Guide } from './guide.entity';
import { Reserve } from './reserve.entity';

@Entity('reviews', { schema: 'app' })
export class Review {
  @PrimaryGeneratedColumn('uuid', { name: 'review_id' })
  reviewId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('uuid', { nullable: true, name: 'booking_id' })
  bookingId!: string | null;

  @Column('uuid', { nullable: true, name: 'guide_id' })
  guideId!: string | null;

  @Column('uuid', { nullable: true, name: 'reserve_id' })
  reserveId!: string | null;

  @Column('int', { name: 'rating' })
  rating!: number; // 1-5

  @Column('varchar', { length: 200, nullable: true, name: 'title' })
  title!: string | null;

  @Column('text', { nullable: true, name: 'comment' })
  comment!: string | null;

  @Column('boolean', { default: false, name: 'is_verified' })
  isVerified!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Booking, (booking) => booking.reviews)
  @JoinColumn({ name: 'booking_id' })
  booking!: Booking | null;

  @ManyToOne(() => Guide, (guide) => guide.reviews)
  @JoinColumn({ name: 'guide_id' })
  guide!: Guide | null;

  @ManyToOne(() => Reserve, (reserve) => reserve.reviews)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve | null;
}
