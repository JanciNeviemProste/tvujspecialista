import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { Lead } from '../database/entities/lead.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Specialist, Lead]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
