import { Module } from '@nestjs/common';
import { ExecplanService } from './execplan.service';
import { ExecplanController } from './execplan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecPlan } from '../common/entities/raw/execplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExecPlan])],
  controllers: [ExecplanController],
  providers: [ExecplanService],
  exports: [TypeOrmModule],
})
export class ExecplanModule {}
