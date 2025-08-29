import { Module } from '@nestjs/common';
import { ServerMetricService } from './server-metric.service';
import { ServerMetricController } from './server-metric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMetrics } from '../common/entities/raw/server_metrics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerMetrics])],
  controllers: [ServerMetricController],
  providers: [ServerMetricService],
  exports: [TypeOrmModule],
})
export class ServerMetricModule {}
