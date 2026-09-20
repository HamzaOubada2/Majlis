import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholar } from './entities/scholar.entity';
import { ScholarsService } from './scholars.service';
import { ScholarsController } from './scholars.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scholar])],
  controllers: [ScholarsController],
  providers: [ScholarsService],
  exports: [ScholarsService, TypeOrmModule],
})
export class ScholarsModule {}