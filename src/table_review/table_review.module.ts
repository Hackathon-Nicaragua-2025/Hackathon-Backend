import { Module } from '@nestjs/common';
import { TableReviewService } from './table_review.service';
import { TableReviewController } from './table_review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableReview } from '../common/entities/model/table-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TableReview])],
  controllers: [TableReviewController],
  providers: [TableReviewService],
  exports: [TypeOrmModule],
})
export class TableReviewModule {}
