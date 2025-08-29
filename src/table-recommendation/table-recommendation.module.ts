import { Module } from '@nestjs/common';
import { TableRecommendationService } from './table-recommendation.service';
import { TableRecommendationController } from './table-recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationTable } from '../common/entities/model/recommendation-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationTable])],
  controllers: [TableRecommendationController],
  providers: [TableRecommendationService],
  exports: [TypeOrmModule],
})
export class TableRecommendationModule {}
