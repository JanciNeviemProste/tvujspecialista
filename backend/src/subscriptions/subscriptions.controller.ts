import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionType } from '../database/entities/subscription.entity';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

class ChangeSubscriptionDto {
  newType: SubscriptionType;
}

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('education/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create education subscription checkout' })
  @ApiResponse({ status: 200, description: 'Checkout session created' })
  async createEducationCheckout(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.createEducationCheckout(req.user.userId);
  }

  @Post('marketplace/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create marketplace subscription checkout' })
  @ApiResponse({ status: 200, description: 'Checkout session created' })
  async createMarketplaceCheckout(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.createMarketplaceCheckout(req.user.userId);
  }

  @Post('premium/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create premium subscription checkout' })
  @ApiResponse({ status: 200, description: 'Checkout session created' })
  async createPremiumCheckout(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.createPremiumCheckout(req.user.userId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my subscriptions' })
  @ApiResponse({ status: 200, description: 'User subscriptions retrieved' })
  async getMySubscriptions(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.findByUserId(req.user.userId);
  }

  @Get('my/active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my active subscription' })
  @ApiResponse({ status: 200, description: 'Active subscription retrieved' })
  async getMyActiveSubscription(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.findActiveByUserId(req.user.userId);
  }

  @Post(':id/upgrade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade subscription' })
  @ApiResponse({ status: 200, description: 'Subscription upgraded' })
  async upgrade(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ChangeSubscriptionDto,
  ) {
    return this.subscriptionsService.upgradeSubscription(
      req.user.userId,
      dto.newType,
    );
  }

  @Post(':id/downgrade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Downgrade subscription' })
  @ApiResponse({ status: 200, description: 'Subscription downgrade scheduled' })
  async downgrade(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ChangeSubscriptionDto,
  ) {
    return this.subscriptionsService.downgradeSubscription(
      req.user.userId,
      dto.newType,
    );
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancel(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(req.user.userId, id);
  }

  @Post(':id/resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resume cancelled subscription' })
  @ApiResponse({ status: 200, description: 'Subscription resumed' })
  async resume(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.subscriptionsService.resumeSubscription(req.user.userId, id);
  }

  @Get('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Stripe customer portal URL' })
  @ApiResponse({ status: 200, description: 'Customer portal URL retrieved' })
  async getCustomerPortal(@Request() req: AuthenticatedRequest) {
    return this.subscriptionsService.getCustomerPortalUrl(req.user.userId);
  }
}
