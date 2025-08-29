import { Module } from '@nestjs/common';
import { DatabaseConfigurationService } from './database-configuration.service';
import { DatabaseConfigurationController } from './database-configuration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from '../common/entities/config/database-configuration.entity';
import { ServerConfiguration } from '../common/entities/config/server-configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseConfiguration, ServerConfiguration])],
  controllers: [DatabaseConfigurationController],
  providers: [DatabaseConfigurationService],
  exports: [DatabaseConfigurationService, TypeOrmModule],
})
export class DatabaseConfigurationModule {}
