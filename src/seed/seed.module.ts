import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Permission, Role, User } from '../common/entities/app';
import { PasswordHasherService } from '../common/services/password-hasher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  providers: [SeedService, PasswordHasherService],
  exports: [SeedService],
})
export class SeedModule {}
