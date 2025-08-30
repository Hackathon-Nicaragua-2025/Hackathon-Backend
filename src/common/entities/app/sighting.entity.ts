import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Bird } from './bird.entity';
import { Location } from './location.entity';
import { Reserve } from './reserve.entity';
import { SightingImage } from './sighting-image.entity';

@Entity('sightings', { schema: 'app' })
export class Sighting {
  @PrimaryGeneratedColumn('uuid', { name: 'sighting_id' })
  sightingId!: string;

  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @Column('uuid', { name: 'bird_id' })
  birdId!: string;

  @Column('uuid', { nullable: true, name: 'location_id' })
  locationId!: string | null;

  @Column('uuid', { nullable: true, name: 'reserve_id' })
  reserveId!: string | null;

  @Column('date', { name: 'sighting_date' })
  sightingDate!: Date;

  @Column('time', { nullable: true, name: 'sighting_time' })
  sightingTime!: string | null;

  @Column('decimal', { precision: 10, scale: 8, nullable: true, name: 'latitude' })
  latitude!: number | null;

  @Column('decimal', { precision: 11, scale: 8, nullable: true, name: 'longitude' })
  longitude!: number | null;

  @Column('varchar', { length: 100, nullable: true, name: 'weather_conditions' })
  weatherConditions!: string | null;

  @Column('varchar', { length: 100, nullable: true, name: 'habitat_type' })
  habitatType!: string | null;

  @Column('text', { nullable: true, name: 'behavior_notes' })
  behaviorNotes!: string | null;

  @Column('int', { default: 1, name: 'count_individuals' })
  countIndividuals!: number;

  @Column('boolean', { default: false, name: 'is_verified' })
  isVerified!: boolean;

  @Column('uuid', { nullable: true, name: 'verified_by' })
  verifiedBy!: string | null;

  @Column('timestamptz', { nullable: true, name: 'verification_date' })
  verificationDate!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.sightings)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Bird, (bird) => bird.sightings)
  @JoinColumn({ name: 'bird_id' })
  bird!: Bird;

  @ManyToOne(() => Location, (location) => location.sightings)
  @JoinColumn({ name: 'location_id' })
  location!: Location | null;

  @ManyToOne(() => Reserve, (reserve) => reserve.sightings)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve | null;

  @ManyToOne(() => User, (user) => user.verifiedSightings)
  @JoinColumn({ name: 'verified_by' })
  verifier!: User | null;

  @OneToMany(() => SightingImage, (sightingImage) => sightingImage.sighting)
  sightingImages!: SightingImage[];
}
