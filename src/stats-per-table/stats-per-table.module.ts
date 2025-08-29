import { Module } from '@nestjs/common';
import { StatsPerTableService } from './stats-per-table.service';
import { StatsPerTableController } from './stats-per-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsPerTable } from '../common/entities/raw/stats-per-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatsPerTable])],
  controllers: [StatsPerTableController],
  providers: [StatsPerTableService],
  exports: [TypeOrmModule],
})
export class StatsPerTableModule {}
