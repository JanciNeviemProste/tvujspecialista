import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { UpdateDealValueDto } from './dto/update-deal-value.dto';
import { CloseDealDto } from './dto/close-deal.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadLimitGuard } from '../leads/guards/lead-limit.guard';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Post()
  @UseGuards(LeadLimitGuard)
  @ApiOperation({ summary: 'Create a new deal (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Deal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(createDealDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my deals' })
  @ApiResponse({ status: 200, description: 'Returns all deals for the authenticated specialist' })
  async getMyDeals(@Request() req) {
    const specialist = await this.dealsService.findBySpecialist(req.user.userId);
    return specialist;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update deal status' })
  @ApiResponse({ status: 200, description: 'Deal status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateDealStatusDto,
  ) {
    return this.dealsService.updateStatus(id, req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/value')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set deal value and estimated close date' })
  @ApiResponse({ status: 200, description: 'Deal value updated' })
  async updateDealValue(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateDealValueDto,
  ) {
    const specialist = await this.dealsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.dealsService.updateDealValue(
      id,
      specialist.id,
      dto.dealValue,
      dto.estimatedCloseDate,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/close')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close deal (won/lost)' })
  @ApiResponse({ status: 200, description: 'Deal closed' })
  async closeDeal(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: CloseDealDto,
  ) {
    const specialist = await this.dealsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.dealsService.closeDeal(
      id,
      specialist.id,
      dto.status,
      dto.actualDealValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reopen')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reopen closed lost deal' })
  @ApiResponse({ status: 200, description: 'Deal reopened' })
  async reopenDeal(@Param('id') id: string, @Request() req) {
    const specialist = await this.dealsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.dealsService.reopenDeal(id, specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/notes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add note to deal' })
  @ApiResponse({ status: 200, description: 'Note added' })
  async addNote(@Param('id') id: string, @Request() req, @Body() addNoteDto: AddNoteDto) {
    return this.dealsService.addNote(id, req.user.userId, addNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/events/:dealId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events for a specific deal' })
  @ApiResponse({ status: 200, description: 'Returns all events for the deal' })
  async getDealEvents(@Param('dealId') dealId: string, @Request() req) {
    const specialist = await this.dealsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.dealsService.getEventsByDeal(dealId, specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/analytics')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get deal analytics' })
  @ApiResponse({ status: 200, description: 'Returns analytics data' })
  async getDealAnalytics(@Request() req) {
    const specialist = await this.dealsService['specialistRepository'].findOne({
      where: { userId: req.user.userId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return this.dealsService.getAnalytics(specialist.id);
  }
}
