import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Query } from '../common/entities/model/query.entity';
import { Table } from '../common/entities/model/table.entity';
import { Application } from '../common/entities/model/application.entity';
import { RecommendationQuery } from '../common/entities/model/query-recommendation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Query, Table, Application, RecommendationQuery])],
  controllers: [QueryController],
  providers: [QueryService],
  exports: [TypeOrmModule],
})
export class QueryModule {}
