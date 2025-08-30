import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guide } from './guide.entity';
import { Reserve } from './reserve.entity';

@Entity('guide_reserves', { schema: 'app' })
export class GuideReserve {
  @PrimaryGeneratedColumn('uuid', { name: 'guide_reserve_id' })
  guideReserveId!: string;

  @Column('uuid', { name: 'guide_id' })
  guideId!: string;

  @Column('uuid', { name: 'reserve_id' })
  reserveId!: string;

  @Column('boolean', { default: true, name: 'is_authorized' })
  isAuthorized!: boolean;

  @Column('date', { nullable: true, name: 'authorization_date' })
  authorizationDate!: Date | null;

  @Column('text', { nullable: true, name: 'notes' })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relaciones
  @ManyToOne(() => Guide, (guide) => guide.guideReserves)
  @JoinColumn({ name: 'guide_id' })
  guide!: Guide;

  @ManyToOne(() => Reserve, (reserve) => reserve.guideReserves)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve;
}
