import { Module } from '@nestjs/common';
import { QueryRecommendationService } from './query-recommendation.service';
import { QueryRecommendationController } from './query-recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationQuery } from '../common/entities/model/query-recommendation.entity';
import { Query } from '../common/entities/model/query.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationQuery, Query])],
  controllers: [QueryRecommendationController],
  providers: [QueryRecommendationService],
  exports: [TypeOrmModule],
})
export class QueryRecommendationModule {}
