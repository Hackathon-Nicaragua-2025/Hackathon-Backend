import { Module } from '@nestjs/common';
import { QueryParsedService } from './query-parsed.service';
import { QueryParsedController } from './query-parsed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryParsed } from '../common/entities/model/query-parsed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueryParsed])],
  controllers: [QueryParsedController],
  providers: [QueryParsedService],
  exports: [TypeOrmModule],
})
export class QueryParsedModule {}
