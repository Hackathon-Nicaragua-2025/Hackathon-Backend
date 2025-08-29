import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Index } from '../common/entities/model/index.entity';
import { Table } from '../common/entities/model/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Index, Table])],
  controllers: [IndexController],
  providers: [IndexService],
  exports: [TypeOrmModule],
})
export class IndexModule {}
