import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholar } from './entities/scholar.entity';
import { ScholarsService } from './scholars.service';
import { ScholarsController } from './scholars.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Scholar]), AuthModule],
  controllers: [ScholarsController],
  providers: [ScholarsService],
  exports: [ScholarsService, TypeOrmModule],
})
export class ScholarsModule {}