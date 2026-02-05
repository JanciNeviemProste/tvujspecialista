import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { Subscription } from '../database/entities/subscription.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { Commission } from '../database/entities/commission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Specialist, Commission]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
