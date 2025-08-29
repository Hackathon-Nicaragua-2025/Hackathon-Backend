import { Module } from '@nestjs/common';
import { QueryExecutionService } from './query_execution.service';
import { QueryExecutionController } from './query_execution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryExecution } from '../common/entities/model/query-execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueryExecution])],
  controllers: [QueryExecutionController],
  providers: [QueryExecutionService],
  exports: [TypeOrmModule],
})
export class QueryExecutionModule {}
