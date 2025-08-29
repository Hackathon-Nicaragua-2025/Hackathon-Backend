import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Permission } from '../common/entities/app/permission.entity';
import { Module as AppWebModule } from '../common/entities/app/module.entity';
import { Role } from '../common/entities/app/role.entity';
import { User } from '../common/entities/app/user.entity';
import { PasswordHasherService } from '../common/services/password-hasher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppWebModule, Permission, Role, User]), // Import the necessary entities
  ],
  providers: [SeedService, PasswordHasherService], // Add SeedService and dependencies
  exports: [SeedService], // Export SeedService so it can be used in AppModule
})
export class SeedModule {}
