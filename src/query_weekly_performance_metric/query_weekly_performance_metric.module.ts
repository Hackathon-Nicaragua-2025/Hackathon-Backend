import { Module } from '@nestjs/common';
import { QueryWeeklyPerformanceMetricService } from './query_weekly_performance_metric.service';
import { QueryWeeklyPerformanceMetricController } from './query_weekly_performance_metric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryWeeklyPerformanceMetric } from '../common/entities/model/query-weekly-performance-metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueryWeeklyPerformanceMetric])],
  controllers: [QueryWeeklyPerformanceMetricController],
  providers: [QueryWeeklyPerformanceMetricService],
  exports: [TypeOrmModule],
})
export class QueryWeeklyPerformanceMetricModule {}
