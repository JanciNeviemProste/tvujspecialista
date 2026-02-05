import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { CommissionsService } from '../services/commissions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WaiveCommissionDto } from '../dto/waive-commission.dto';

@ApiTags('commissions')
@Controller('commissions')
export class CommissionsController {
  constructor(private commissionsService: CommissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my commissions' })
  @ApiResponse({ status: 200, description: 'Returns all commissions for the authenticated specialist' })
  async getMyCommissions(@Request() req) {
    const specialist = await this.commissionsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    return this.commissionsService.getMyCommissions(specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get commission statistics' })
  @ApiResponse({ status: 200, description: 'Returns commission statistics' })
  async getMyStats(@Request() req) {
    const specialist = await this.commissionsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    return this.commissionsService.getCommissionStats(specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate commission payment' })
  @ApiResponse({ status: 200, description: 'Returns Stripe client secret for payment' })
  async payCommission(@Param('id') id: string, @Request() req) {
    const specialist = await this.commissionsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    return this.commissionsService.payCommission(id, specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending commissions (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all pending commissions' })
  async getAllPending(@Request() req) {
    // TODO: Add admin guard
    return this.commissionsService.getAllPending();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/waive')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Waive commission (Admin only)' })
  @ApiResponse({ status: 200, description: 'Commission waived' })
  async waiveCommission(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: WaiveCommissionDto,
  ) {
    // TODO: Add admin guard
    return this.commissionsService.waiveCommission(id, dto.note);
  }
}
