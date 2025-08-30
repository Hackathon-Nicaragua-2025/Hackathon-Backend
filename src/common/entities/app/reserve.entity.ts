import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Location } from './location.entity';
import { Booking } from './booking.entity';
import { Sighting } from './sighting.entity';
import { Event } from './event.entity';
import { BirdReserve } from './bird-reserve.entity';
import { GuideReserve } from './guide-reserve.entity';
import { ReserveImage } from './reserve-image.entity';
import { Review } from './review.entity';

@Entity('reserves', { schema: 'app' })
export class Reserve {
  @PrimaryGeneratedColumn('uuid', { name: 'reserve_id' })
  reserveId!: string;

  @Column('varchar', { length: 200, name: 'name' })
  name!: string;

  @Column('text', { nullable: true, name: 'description' })
  description!: string | null;

  @Column('uuid', { nullable: true, name: 'location_id' })
  locationId!: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, name: 'area_hectares' })
  areaHectares!: number | null;

  @Column('date', { nullable: true, name: 'established_date' })
  establishedDate!: Date | null;

  @Column('varchar', { length: 200, nullable: true, name: 'management_entity' })
  managementEntity!: string | null;

  @Column('varchar', { length: 50, nullable: true, name: 'contact_phone' })
  contactPhone!: string | null;

  @Column('varchar', { length: 200, nullable: true, name: 'contact_email' })
  contactEmail!: string | null;

  @Column('text', { nullable: true, name: 'website_url' })
  websiteUrl!: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, name: 'entrance_fee' })
  entranceFee!: number | null;

  @Column('text', { nullable: true, name: 'opening_hours' })
  openingHours!: string | null;

  @Column('text', { nullable: true, name: 'facilities' })
  facilities!: string | null; // JSON o texto con comodidades

  @Column('text', { nullable: true, name: 'rules' })
  rules!: string | null; // Reglas y restricciones

  @Column('boolean', { default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => Location, (location) => location.reserves)
  @JoinColumn({ name: 'location_id' })
  location!: Location | null;

  @OneToMany(() => Booking, (booking) => booking.reserve)
  bookings!: Booking[];

  @OneToMany(() => Sighting, (sighting) => sighting.reserve)
  sightings!: Sighting[];

  @OneToMany(() => Event, (event) => event.reserve)
  events!: Event[];

  @OneToMany(() => BirdReserve, (birdReserve) => birdReserve.reserve)
  birdReserves!: BirdReserve[];

  @OneToMany(() => GuideReserve, (guideReserve) => guideReserve.reserve)
  guideReserves!: GuideReserve[];

  @OneToMany(() => ReserveImage, (reserveImage) => reserveImage.reserve)
  reserveImages!: ReserveImage[];

  @OneToMany(() => Review, (review) => review.reserve)
  reviews!: Review[];
}
