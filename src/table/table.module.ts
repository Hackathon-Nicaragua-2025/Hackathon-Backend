import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from '../common/entities/model/table.entity';
import { Query } from '../common/entities/model/query.entity';
import { TableRelation } from '../common/entities/model/table-relation.entity';
import { Index } from '../common/entities/model/index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Query, TableRelation, Index])],
  controllers: [TableController],
  providers: [TableService],
  exports: [TypeOrmModule],
})
export class TableModule {}
