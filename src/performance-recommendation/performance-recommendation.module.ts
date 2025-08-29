import { Module } from '@nestjs/common';
import { PerformanceRecommendationService } from './performance-recommendation.service';
import { PerformanceRecommendationController } from './performance-recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceRecommendation } from '../common/entities/aggmodel/performance-recommendation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceRecommendation])],
  controllers: [PerformanceRecommendationController],
  providers: [PerformanceRecommendationService],
  exports: [TypeOrmModule],
})
export class PerformanceRecommendationModule {}
