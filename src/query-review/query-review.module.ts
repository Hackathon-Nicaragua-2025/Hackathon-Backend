import { Module } from '@nestjs/common';
import { QueryReviewService } from './query-review.service';
import { QueryReviewController } from './query-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryReview } from '../common/entities/model/query-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueryReview])],
  controllers: [QueryReviewController],
  providers: [QueryReviewService],
  exports: [TypeOrmModule],
})
export class QueryReviewModule {}
