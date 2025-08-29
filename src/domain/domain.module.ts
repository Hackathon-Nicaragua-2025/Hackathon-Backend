import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from '../common/entities/model/domain.entity';
import { Application } from '../common/entities/model/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Domain, Application])],
  controllers: [DomainController],
  providers: [DomainService],
  exports: [TypeOrmModule],
})
export class DomainModule {}
