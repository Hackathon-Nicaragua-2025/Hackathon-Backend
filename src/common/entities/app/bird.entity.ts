import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sighting } from './sighting.entity';
import { BirdReserve } from './bird-reserve.entity';
import { BirdImage } from './bird-image.entity';

@Entity('birds', { schema: 'app' })
export class Bird {
  @PrimaryGeneratedColumn('uuid', { name: 'bird_id' })
  birdId!: string;

  @Column('varchar', { length: 200, name: 'scientific_name' })
  scientificName!: string;

  @Column('varchar', { length: 200, name: 'common_name' })
  commonName!: string;

  @Column('varchar', { length: 100, nullable: true, name: 'family' })
  family!: string | null;

  @Column('varchar', { length: 100, nullable: true, name: 'order_name' })
  orderName!: string | null;

  @Column('text', { nullable: true, name: 'habitat' })
  habitat!: string | null;

  @Column('text', { nullable: true, name: 'description' })
  description!: string | null;

  @Column('varchar', { length: 50, nullable: true, name: 'conservation_status' })
  conservationStatus!: string | null; // 'LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'

  @Column('boolean', { default: false, name: 'is_endemic' })
  isEndemic!: boolean;

  @Column('boolean', { default: false, name: 'is_migratory' })
  isMigratory!: boolean;

  @Column('varchar', { length: 100, nullable: true, name: 'breeding_season' })
  breedingSeason!: string | null;

  @Column('varchar', { length: 200, nullable: true, name: 'diet' })
  diet!: string | null;

  @Column('varchar', { length: 50, nullable: true, name: 'size_cm' })
  sizeCm!: string | null;

  @Column('varchar', { length: 50, nullable: true, name: 'weight_grams' })
  weightGrams!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @OneToMany(() => Sighting, (sighting) => sighting.bird)
  sightings!: Sighting[];

  @OneToMany(() => BirdReserve, (birdReserve) => birdReserve.bird)
  birdReserves!: BirdReserve[];

  @OneToMany(() => BirdImage, (birdImage) => birdImage.bird)
  birdImages!: BirdImage[];
}
