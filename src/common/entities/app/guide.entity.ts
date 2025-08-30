import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { GuideReserve } from './guide-reserve.entity';
import { Review } from './review.entity';

@Entity('guides', { schema: 'app' })
export class Guide {
  @PrimaryGeneratedColumn('uuid', { name: 'guide_id' })
  guideId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('varchar', { length: 100, nullable: true, name: 'certification_number' })
  certificationNumber!: string | null;

  @Column('date', { nullable: true, name: 'certification_date' })
  certificationDate!: Date | null;

  @Column('varchar', { length: 200, nullable: true, name: 'certification_entity' })
  certificationEntity!: string | null;

  @Column('int', { default: 0, name: 'experience_years' })
  experienceYears!: number;

  @Column('text', { nullable: true, name: 'specialties' })
  specialties!: string | null; // JSON o texto con especialidades

  @Column('text', { nullable: true, name: 'languages' })
  languages!: string | null; // JSON o texto con idiomas

  @Column('text', { nullable: true, name: 'bio' })
  bio!: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, name: 'hourly_rate' })
  hourlyRate!: number | null;

  @Column('boolean', { default: false, name: 'is_verified' })
  isVerified!: boolean;

  @Column('boolean', { default: true, name: 'is_available' })
  isAvailable!: boolean;

  @Column('decimal', { precision: 3, scale: 2, default: 0, name: 'rating' })
  rating!: number;

  @Column('int', { default: 0, name: 'total_reviews' })
  totalReviews!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.guide)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Booking, (booking) => booking.guide)
  bookings!: Booking[];

  @OneToMany(() => GuideReserve, (guideReserve) => guideReserve.guide)
  guideReserves!: GuideReserve[];

  @OneToMany(() => Review, (review) => review.guide)
  reviews!: Review[];
}
