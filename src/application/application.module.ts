import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from '../common/entities/model/domain.entity';
import { Query } from '../common/entities/model/query.entity';
import { Application } from '../common/entities/model/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Domain, Query])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [TypeOrmModule],
})
export class ApplicationModule {}
