import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bird } from './bird.entity';
import { MediaFile } from './media-file.entity';

@Entity('bird_images', { schema: 'app' })
export class BirdImage {
  @PrimaryGeneratedColumn('uuid', { name: 'bird_image_id' })
  birdImageId!: string;

  @Column('uuid', { nullable: true, name: 'bird_id' })
  birdId!: string | null;

  @Column('uuid', { name: 'media_id' })
  mediaId!: string;

  @Column('int', { default: 0, name: 'orden' })
  orden!: number;

  // Relaciones
  @ManyToOne(() => Bird, (bird) => bird.birdImages)
  @JoinColumn({ name: 'bird_id' })
  bird!: Bird | null;

  @ManyToOne(() => MediaFile, (mediaFile) => mediaFile.birdImages)
  @JoinColumn({ name: 'media_id' })
  mediaFile!: MediaFile;
}
