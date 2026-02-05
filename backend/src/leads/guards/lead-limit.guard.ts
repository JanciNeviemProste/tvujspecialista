import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist, SubscriptionTier } from '../../database/entities/specialist.entity';

@Injectable()
export class LeadLimitGuard implements CanActivate {
  constructor(
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { specialistId } = request.body;

    if (!specialistId) {
      return true;
    }

    const specialist = await this.specialistRepository.findOne({ where: { id: specialistId } });
    if (!specialist) {
      throw new BadRequestException('Specialist not found');
    }

    const limits = {
      [SubscriptionTier.BASIC]: 10,
      [SubscriptionTier.PRO]: 50,
      [SubscriptionTier.PREMIUM]: Number.MAX_SAFE_INTEGER,
    };

    const limit = limits[specialist.subscriptionTier];
    if (specialist.leadsThisMonth >= limit) {
      throw new BadRequestException(
        `Specialist has reached the monthly lead limit for ${specialist.subscriptionTier} tier`,
      );
    }

    return true;
  }
}
