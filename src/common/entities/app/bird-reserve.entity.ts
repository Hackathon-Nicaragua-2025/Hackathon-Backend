import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bird } from './bird.entity';
import { Reserve } from './reserve.entity';

@Entity('bird_reserves', { schema: 'app' })
export class BirdReserve {
  @PrimaryGeneratedColumn('uuid', { name: 'bird_reserve_id' })
  birdReserveId!: string;

  @Column('uuid', { name: 'bird_id' })
  birdId!: string;

  @Column('uuid', { name: 'reserve_id' })
  reserveId!: string;

  @Column('varchar', { length: 20, nullable: true, name: 'abundance_level' })
  abundanceLevel!: string | null; // 'rare', 'uncommon', 'common', 'abundant'

  @Column('varchar', { length: 100, nullable: true, name: 'best_season' })
  bestSeason!: string | null;

  @Column('text', { nullable: true, name: 'notes' })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relaciones
  @ManyToOne(() => Bird, (bird) => bird.birdReserves)
  @JoinColumn({ name: 'bird_id' })
  bird!: Bird;

  @ManyToOne(() => Reserve, (reserve) => reserve.birdReserves)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve;
}
