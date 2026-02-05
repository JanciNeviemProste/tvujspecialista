import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionsController } from './controllers/commissions.controller';
import { CommissionsService } from './services/commissions.service';
import { Commission } from '../database/entities/commission.entity';
import { Deal } from '../database/entities/deal.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { StripeModule } from '../stripe/stripe.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission, Deal, Specialist]),
    StripeModule,
    EmailModule,
  ],
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}
