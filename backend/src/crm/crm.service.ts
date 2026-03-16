import { Injectable, Logger } from '@nestjs/common';
import { Deal } from '../database/entities/deal.entity';
import {
  Specialist,
  CrmProvider,
} from '../database/entities/specialist.entity';

export interface CrmPushResult {
  success: boolean;
  provider: CrmProvider;
  externalId?: string;
  error?: string;
}

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  async pushLeadToCrm(
    deal: Deal,
    specialist: Specialist,
  ): Promise<CrmPushResult> {
    if (
      specialist.crmProvider === CrmProvider.NONE ||
      !specialist.crmTipsterAccount
    ) {
      return { success: true, provider: CrmProvider.NONE };
    }

    this.logger.log(
      `Pushing deal ${deal.id} to ${specialist.crmProvider} (tipster: ${specialist.crmTipsterAccount})`,
    );

    // Phase 1: Mock push — always succeeds
    // Phase 2: switch(specialist.crmProvider) for real API integrations
    return this.mockPush(specialist);
  }

  private async mockPush(specialist: Specialist): Promise<CrmPushResult> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      success: true,
      provider: specialist.crmProvider,
      externalId: `mock-${specialist.crmProvider}-${Date.now()}`,
    };
  }
}
