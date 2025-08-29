import { Module } from '@nestjs/common';
import { DatabaseInformationService } from './database-information.service';
import { DatabaseInformationController } from './database-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseInformation } from '../common/entities/raw/database-information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseInformation])],
  controllers: [DatabaseInformationController],
  providers: [DatabaseInformationService],
  exports: [TypeOrmModule],
})
export class DatabaseInformationModule {}
