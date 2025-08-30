import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserve } from './reserve.entity';
import { MediaFile } from './media-file.entity';

@Entity('reserve_images', { schema: 'app' })
export class ReserveImage {
  @PrimaryGeneratedColumn('uuid', { name: 'reserve_image_id' })
  reserveImageId!: string;

  @Column('uuid', { nullable: true, name: 'reserve_id' })
  reserveId!: string | null;

  @Column('uuid', { name: 'media_id' })
  mediaId!: string;

  @Column('int', { default: 0, name: 'orden' })
  orden!: number;

  // Relaciones
  @ManyToOne(() => Reserve, (reserve) => reserve.reserveImages)
  @JoinColumn({ name: 'reserve_id' })
  reserve!: Reserve | null;

  @ManyToOne(() => MediaFile, (mediaFile) => mediaFile.reserveImages)
  @JoinColumn({ name: 'media_id' })
  mediaFile!: MediaFile;
}
