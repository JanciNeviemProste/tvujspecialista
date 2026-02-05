import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistsController } from './specialists.controller';
import { SpecialistsService } from './specialists.service';
import { Specialist } from '../database/entities/specialist.entity';
import { Review } from '../database/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist, Review])],
  controllers: [SpecialistsController],
  providers: [SpecialistsService],
  exports: [SpecialistsService],
})
export class SpecialistsModule {}
