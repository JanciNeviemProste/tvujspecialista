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
import { AdminGuard } from '../../auth/guards/admin.guard';
import { WaiveCommissionDto } from '../dto/waive-commission.dto';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

@ApiTags('commissions')
@Controller('commissions')
export class CommissionsController {
  constructor(private commissionsService: CommissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my commissions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all commissions for the authenticated specialist',
  })
  async getMyCommissions(@Request() req: AuthenticatedRequest) {
    const specialist = await this.commissionsService[
      'specialistRepository'
    ].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.commissionsService.getMyCommissions(specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get commission statistics' })
  @ApiResponse({ status: 200, description: 'Returns commission statistics' })
  async getMyStats(@Request() req: AuthenticatedRequest) {
    const specialist = await this.commissionsService[
      'specialistRepository'
    ].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.commissionsService.getCommissionStats(specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate commission payment' })
  @ApiResponse({
    status: 200,
    description: 'Returns Stripe client secret for payment',
  })
  async payCommission(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const specialist = await this.commissionsService[
      'specialistRepository'
    ].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.commissionsService.payCommission(id, specialist.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('pending')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending commissions (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all pending commissions' })
  async getAllPending(@Request() _req: AuthenticatedRequest) {
    return this.commissionsService.getAllPending();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/waive')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Waive commission (Admin only)' })
  @ApiResponse({ status: 200, description: 'Commission waived' })
  async waiveCommission(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: WaiveCommissionDto,
  ) {
    return this.commissionsService.waiveCommission(id, dto.note);
  }
}
