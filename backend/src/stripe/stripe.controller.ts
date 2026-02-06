import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout')
  async createCheckout(
    @Request() req: AuthenticatedRequest,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    return this.stripeService.createCheckoutSession(
      req.user.userId,
      createCheckoutDto,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.stripeService.handleWebhook(signature, req.rawBody!);
  }
}
