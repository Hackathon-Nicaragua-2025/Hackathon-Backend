import { Module } from '@nestjs/common';
import { TableWeeklyPerformanceMetricService } from './table_weekly_performance_metric.service';
import { TableWeeklyPerformanceMetricController } from './table_weekly_performance_metric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableWeeklyPerformanceMetric } from '../common/entities/model/table-weekly-performance-metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TableWeeklyPerformanceMetric])],
  controllers: [TableWeeklyPerformanceMetricController],
  providers: [TableWeeklyPerformanceMetricService],
  exports: [TypeOrmModule],
})
export class TableWeeklyPerformanceMetricModule {}
