import { Module } from '@nestjs/common';
import { StatsPerIndexService } from './stats-per-index.service';
import { StatsPerIndexController } from './stats-per-index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsPerIndex } from '../common/entities/raw/stats-per-index.entity';
@Module({
  imports: [TypeOrmModule.forFeature([StatsPerIndex])],
  controllers: [StatsPerIndexController],
  providers: [StatsPerIndexService],
  exports: [TypeOrmModule],
})
export class StatsPerIndexModule {}
