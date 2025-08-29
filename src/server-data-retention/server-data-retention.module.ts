import { Module } from '@nestjs/common';
import { ServerDataRetentionService } from './server-data-retention.service';
import { ServerDataRetentionController } from './server-data-retention.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerDataRetention } from '../common/entities/config/server-data-retention .entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerDataRetention])],
  controllers: [ServerDataRetentionController],
  providers: [ServerDataRetentionService],
  exports: [TypeOrmModule],
})
export class ServerDataRetentionModule {}
