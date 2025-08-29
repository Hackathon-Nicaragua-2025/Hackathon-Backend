import { Module } from '@nestjs/common';
import { IndexWeeklyPerformanceMetricService } from './index_weekly_performance_metric.service';
import { IndexWeeklyPerformanceMetricController } from './index_weekly_performance_metric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexWeeklyPerformanceMetric } from '../common/entities/model/index-weekly-performance-metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndexWeeklyPerformanceMetric])],
  controllers: [IndexWeeklyPerformanceMetricController],
  providers: [IndexWeeklyPerformanceMetricService],
  exports: [TypeOrmModule],
})
export class IndexWeeklyPerformanceMetricModule {}
