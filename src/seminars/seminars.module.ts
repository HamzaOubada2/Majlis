import { Module } from '@nestjs/common';
import { SeminarsController } from './seminars.controller';
import { SeminarsService } from './seminars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seminar } from './entities/seminar.entity';
import { ScholarsModule } from '../scholars/scholars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seminar]),
    ScholarsModule
  ],
  controllers: [SeminarsController],
  providers: [SeminarsService],
  exports: [SeminarsService, TypeOrmModule]
})
export class SeminarsModule {}
