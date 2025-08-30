import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BirdImage } from './bird-image.entity';
import { ReserveImage } from './reserve-image.entity';
import { SightingImage } from './sighting-image.entity';

@Entity('media_files', { schema: 'app' })
export class MediaFile {
  @PrimaryGeneratedColumn('uuid', { name: 'media_id' })
  mediaId!: string;

  @Column('text', { name: 'url' })
  url!: string;

  @Column('varchar', { length: 500, nullable: true, name: 'file_name' })
  fileName!: string | null;

  @Column('varchar', { length: 200, nullable: true, name: 'mime_type' })
  mimeType!: string | null;

  @Column('bigint', { nullable: true, name: 'size_bytes' })
  sizeBytes!: number | null;

  @Column('uuid', { nullable: true, name: 'uploaded_by' })
  uploadedBy!: string | null;

  @Column('boolean', { default: true, name: 'is_public' })
  isPublic!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.mediaFiles)
  @JoinColumn({ name: 'uploaded_by' })
  uploader!: User | null;

  @OneToMany(() => BirdImage, (birdImage) => birdImage.mediaFile)
  birdImages!: BirdImage[];

  @OneToMany(() => ReserveImage, (reserveImage) => reserveImage.mediaFile)
  reserveImages!: ReserveImage[];

  @OneToMany(() => SightingImage, (sightingImage) => sightingImage.mediaFile)
  sightingImages!: SightingImage[];
}
