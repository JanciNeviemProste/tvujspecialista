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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadLimitGuard } from './guards/lead-limit.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @UseGuards(LeadLimitGuard)
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  @ApiResponse({ status: 429, description: 'Lead limit reached' })
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my leads as specialist' })
  @ApiResponse({ status: 200, description: 'Returns specialist leads' })
  async getMyLeads(@Request() req: AuthenticatedRequest) {
    const specialist = await this.leadsService.findSpecialistByUserId(req.user.userId);
    return this.leadsService.findBySpecialist(specialist.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead status' })
  @ApiResponse({ status: 200, description: 'Lead status updated' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async updateStatus(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateDto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/notes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add note to a lead' })
  @ApiResponse({ status: 201, description: 'Note added to lead' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async addNote(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.leadsService.addNote(id, req.user.userId, addNoteDto);
  }
}
