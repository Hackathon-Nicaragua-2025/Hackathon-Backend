import { Module } from '@nestjs/common';
import { ServerConfigurationService } from './server-configuration.service';
import { ServerConfigurationController } from './server-configuration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfiguration } from '../common/entities/config/server-configuration.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PasswordHasherService } from '../common/services/password-hasher.service';
import { CacheService } from '../common/services/cache.service';
import { ConnectionService } from '../common/services/connection.service';
import { DatabaseConfigurationService } from '../database-configuration/database-configuration.service';
import { DatabaseConfiguration } from '../common/entities/config/database-configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerConfiguration, DatabaseConfiguration]), AuditLogModule],
  controllers: [ServerConfigurationController],
  providers: [
    PasswordHasherService,
    DatabaseConfigurationService,
    CacheService,
    ServerConfigurationService,
    ConnectionService,
  ],
  exports: [TypeOrmModule],
})
export class ServerConfigurationModule {}
