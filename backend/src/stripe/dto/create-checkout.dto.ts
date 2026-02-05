import { IsNotEmpty, IsEnum } from 'class-validator';
import { SubscriptionTier } from '../../database/entities/specialist.entity';

export class CreateCheckoutDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;
}
