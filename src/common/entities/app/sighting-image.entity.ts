import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sighting } from './sighting.entity';
import { MediaFile } from './media-file.entity';

@Entity('sighting_images', { schema: 'app' })
export class SightingImage {
  @PrimaryGeneratedColumn('uuid', { name: 'sighting_image_id' })
  sightingImageId!: string;

  @Column('uuid', { nullable: true, name: 'sighting_id' })
  sightingId!: string | null;

  @Column('uuid', { name: 'media_id' })
  mediaId!: string;

  // Relaciones
  @ManyToOne(() => Sighting, (sighting) => sighting.sightingImages)
  @JoinColumn({ name: 'sighting_id' })
  sighting!: Sighting | null;

  @ManyToOne(() => MediaFile, (mediaFile) => mediaFile.sightingImages)
  @JoinColumn({ name: 'media_id' })
  mediaFile!: MediaFile;
}
