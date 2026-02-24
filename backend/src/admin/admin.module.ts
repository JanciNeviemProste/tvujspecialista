import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { Lead } from '../database/entities/lead.entity';
import { Event } from '../database/entities/event.entity';
import { CommunityModule } from '../community/community.module';
import { AcademyModule } from '../academy/academy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Specialist, Lead, Event]),
    CommunityModule,
    AcademyModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
