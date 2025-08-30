import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Reserve } from './reserve.entity';
import { Event } from './event.entity';
import { Sighting } from './sighting.entity';

@Entity('locations', { schema: 'app' })
export class Location {
  @PrimaryGeneratedColumn('uuid', { name: 'location_id' })
  locationId!: string;

  @Column('varchar', { length: 200, name: 'name' })
  name!: string;

  @Column('text', { nullable: true, name: 'description' })
  description!: string | null;

  @Column('decimal', { precision: 10, scale: 8, nullable: true, name: 'latitude' })
  latitude!: number | null;

  @Column('decimal', { precision: 11, scale: 8, nullable: true, name: 'longitude' })
  longitude!: number | null;

  @Column('text', { nullable: true, name: 'address' })
  address!: string | null;

  @Column('varchar', { length: 100, nullable: true, name: 'city' })
  city!: string | null;

  @Column('varchar', { length: 100, nullable: true, name: 'department' })
  department!: string | null;

  @Column('varchar', { length: 100, default: 'Nicaragua', name: 'country' })
  country!: string;

  @Column('int', { nullable: true, name: 'elevation_meters' })
  elevationMeters!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @OneToMany(() => Reserve, (reserve) => reserve.location)
  reserves!: Reserve[];

  @OneToMany(() => Event, (event) => event.location)
  events!: Event[];

  @OneToMany(() => Sighting, (sighting) => sighting.location)
  sightings!: Sighting[];
}
