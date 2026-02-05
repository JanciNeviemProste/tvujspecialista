import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { Deal } from '../database/entities/deal.entity';
import { LeadEvent } from '../database/entities/lead-event.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { EmailModule } from '../email/email.module';
import { CommissionsModule } from '../commissions/commissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deal, LeadEvent, Specialist]),
    EmailModule,
    forwardRef(() => CommissionsModule),
  ],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {}
