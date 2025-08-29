import { Module } from '@nestjs/common';
import { StoreProceduresService } from './store-procedures.service';
import { StoreProceduresController } from './store-procedures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProcedures } from '../common/entities/raw/store-procedures.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProcedures])],
  controllers: [StoreProceduresController],
  providers: [StoreProceduresService],
  exports: [TypeOrmModule],
})
export class StoreProceduresModule {}
