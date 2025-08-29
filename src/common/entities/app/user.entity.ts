import {
  Entity,
  Column,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RefreshToken } from './refresh-token.entity';
import { Role } from './role.entity';
import { VerificationToken } from './verification-token.entity';
import { LoginAudit } from './login-audit.entity';

@Entity('Users', { schema: 'app' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'UserId' })
  userId!: string;

  @Column('nvarchar', { length: 200, name: 'Nombre' })
  nombre!: string;

  @Column('nvarchar', { length: 200, name: 'Email' })
  email!: string;

  @Column('nvarchar', { length: 200, name: 'EmailNormalized' })
  emailNormalized!: string;

  @Column('nvarchar', { length: 500, nullable: true, name: 'PasswordHash' })
  @Exclude()
  passwordHash!: string;

  @Column('nvarchar', { length: 50, nullable: true, name: 'Phone' })
  phone!: string;

  @Column('nvarchar', { nullable: true, name: 'AvatarUrl' })
  avatarUrl!: string;

  @Column('bit', { default: false, name: 'IsVerified' })
  isVerified!: boolean;

  @Column('bit', { default: true, name: 'IsActive' })
  isActive!: boolean;

  @Column('int', { default: 0, name: 'FailedLoginCount' })
  failedLoginCount!: number;

  @Column('datetime2', { nullable: true, name: 'LockoutUntil' })
  lockoutUntil!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @Column('datetime2', { nullable: true, name: 'LastLoginAt' })
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

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
      this.emailNormalized = this.email.toLowerCase().trim();
    }
  }
}
