import {
  Entity,
  Column,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RefreshToken } from './refresh-token.entity';
import { Role } from './role.entity';
import { VerificationToken } from './verification-token.entity';
import { LoginAudit } from './login-audit.entity';
import { Booking } from './booking.entity';
import { Sighting } from './sighting.entity';
import { Event } from './event.entity';
import { Review } from './review.entity';
import { Notification } from './notification.entity';
import { MediaFile } from './media-file.entity';
import { BookingHistory } from './booking-history.entity';
import { Guide } from './guide.entity';
import { Payment } from './payment.entity';

@Entity('Users', { schema: 'app' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'UserId' })
  userId!: string;

  @Column('varchar', { length: 200, name: 'Nombre' })
  nombre!: string;

  @Column('varchar', { length: 200, name: 'Email' })
  email!: string;

  @Column('varchar', { length: 200, name: 'EmailNormalized' })
  emailNormalized!: string;

  @Column('varchar', { length: 500, nullable: true, name: 'PasswordHash' })
  @Exclude()
  passwordHash!: string;

  @Column('varchar', { length: 50, nullable: true, name: 'Phone' })
  phone!: string;

  @Column('varchar', { nullable: true, name: 'AvatarUrl' })
  avatarUrl!: string;

  @Column('boolean', { default: false, name: 'IsVerified' })
  isVerified!: boolean;

  @Column('boolean', { default: true, name: 'IsActive' })
  isActive!: boolean;

  @Column('int', { default: 0, name: 'FailedLoginCount' })
  failedLoginCount!: number;

  @Column('timestamptz', { nullable: true, name: 'LockoutUntil' })
  lockoutUntil!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @Column('timestamptz', { nullable: true, name: 'LastLoginAt' })
  lastLoginAt!: Date | null;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'UserRoles',
    schema: 'app',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'userId',
    },
    inverseJoinColumn: {
      name: 'RoleId',
      referencedColumnName: 'roleId',
    },
  })
  roles!: Role[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => VerificationToken, (verificationToken) => verificationToken.user)
  verificationTokens!: VerificationToken[];

  @OneToMany(() => LoginAudit, (loginAudit) => loginAudit.user)
  loginAudits!: LoginAudit[];

  // Nuevas relaciones del dominio de aviturismo
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];

  @OneToMany(() => Sighting, (sighting) => sighting.user)
  sightings!: Sighting[];

  @OneToMany(() => Sighting, (sighting) => sighting.verifier)
  verifiedSightings!: Sighting[];

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents!: Event[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @OneToMany(() => MediaFile, (mediaFile) => mediaFile.uploader)
  mediaFiles!: MediaFile[];

  @OneToMany(() => BookingHistory, (bookingHistory) => bookingHistory.changedByUser)
  bookingHistoryChanges!: BookingHistory[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  // Relación con Guide (OneToOne)
  @OneToOne(() => Guide, (guide) => guide.user)
  guide!: Guide | null;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
      this.emailNormalized = this.email.toLowerCase().trim();
    }
  }

  // Propiedades getter para compatibilidad con el código existente
  get id(): string {
    return this.userId;
  }

  get password(): string | null {
    return this.passwordHash;
  }

  get firstName(): string {
    return this.nombre.split(' ')[0] || this.nombre;
  }

  get lastName(): string {
    const parts = this.nombre.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }
}
