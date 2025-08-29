import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../common/entities/model/database.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Database])],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
