import { Module } from '@nestjs/common';
import { MissingIndexService } from './missing-index.service';
import { MissingIndexController } from './missing-index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissingIndex } from '../common/entities/raw/missing-index.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissingIndex])],
  controllers: [MissingIndexController],
  providers: [MissingIndexService],
  exports: [TypeOrmModule],
})
export class MissingIndexModule {}
