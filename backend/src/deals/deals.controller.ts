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
import { AddNoteDto } from './dto/add-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadLimitGuard } from '../leads/guards/lead-limit.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { DealResponseDto } from './dto/deal-response.dto';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Post()
  @UseGuards(LeadLimitGuard)
  @ApiOperation({ summary: 'Create a new deal (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Deal created successfully', type: DealResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(createDealDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my deals' })
  @ApiResponse({
    status: 200,
    description: 'Returns all deals for the authenticated specialist',
    type: [DealResponseDto],
  })
  async getMyDeals(@Request() req: AuthenticatedRequest) {
    const specialist = await this.dealsService.findSpecialistByUserId(req.user.userId);
    return this.dealsService.findBySpecialist(specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update deal status' })
  @ApiResponse({ status: 200, description: 'Deal status updated', type: DealResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateDto: UpdateDealStatusDto,
  ) {
    return this.dealsService.updateStatus(id, req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/notes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add note to deal' })
  @ApiResponse({ status: 200, description: 'Note added' })
  async addNote(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.dealsService.addNote(id, req.user.userId, addNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/events/:dealId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events for a specific deal' })
  @ApiResponse({ status: 200, description: 'Returns all events for the deal' })
  async getDealEvents(
    @Param('dealId') dealId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const specialist = await this.dealsService.findSpecialistByUserId(req.user.userId);

    return this.dealsService.getEventsByDeal(dealId, specialist.id);
  }

}
