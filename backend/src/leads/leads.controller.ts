import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadLimitGuard } from './guards/lead-limit.guard';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @UseGuards(LeadLimitGuard)
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyLeads(@Request() req) {
    const specialist = await this.leadsService.findBySpecialist(req.user.userId);
    return specialist;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/notes')
  async addNote(@Param('id') id: string, @Request() req, @Body() addNoteDto: AddNoteDto) {
    return this.leadsService.addNote(id, req.user.userId, addNoteDto);
  }
}
