import { Module } from '@nestjs/common';
import { RecommendationListService } from './recommendation-list.service';
import { RecommendationListController } from './recommendation-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationList } from '../common/entities/config/recommendation-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationList])],
  controllers: [RecommendationListController],
  providers: [RecommendationListService],
  exports: [TypeOrmModule],
})
export class RecommendationListModule {}
