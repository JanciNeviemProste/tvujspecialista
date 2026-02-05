import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RSVPsService } from '../services/rsvps.service';
import { CreateRSVPDto } from '../dto/create-rsvp.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Community - RSVPs')
@Controller('community')
export class RSVPsController {
  constructor(private rsvpsService: RSVPsService) {}

  @Post('events/:eventId/rsvp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RSVP to an event' })
  @ApiResponse({ status: 201, description: 'Successfully registered for event' })
  @ApiResponse({ status: 400, description: 'Event not published or at capacity' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 409, description: 'Already registered for this event' })
  async rsvp(
    @Request() req,
    @Param('eventId') eventId: string,
    @Body() dto: CreateRSVPDto,
  ) {
    return this.rsvpsService.rsvp(req.user.userId, eventId, dto.notes);
  }

  @Get('rsvps/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my RSVPs' })
  @ApiResponse({ status: 200, description: 'Returns list of user RSVPs' })
  async findMyRSVPs(@Request() req) {
    return this.rsvpsService.findMyRSVPs(req.user.userId);
  }

  @Patch('rsvps/:id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm RSVP' })
  @ApiResponse({ status: 200, description: 'RSVP confirmed successfully' })
  @ApiResponse({ status: 404, description: 'RSVP not found' })
  @ApiResponse({ status: 400, description: 'Cannot confirm cancelled or already confirmed RSVP' })
  @ApiResponse({ status: 403, description: 'Not authorized to confirm this RSVP' })
  async confirm(@Request() req, @Param('id') id: string) {
    return this.rsvpsService.confirm(id, req.user.userId);
  }

  @Patch('rsvps/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel RSVP' })
  @ApiResponse({ status: 200, description: 'RSVP cancelled successfully' })
  @ApiResponse({ status: 404, description: 'RSVP not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel attended or already cancelled RSVP' })
  @ApiResponse({ status: 403, description: 'Not authorized to cancel this RSVP' })
  async cancel(@Request() req, @Param('id') id: string) {
    await this.rsvpsService.cancel(id, req.user.userId);
    return { message: 'RSVP cancelled successfully' };
  }

  @Post('rsvps/:id/check-in')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check in attendee (organizer only)' })
  @ApiResponse({ status: 200, description: 'Attendee checked in successfully' })
  @ApiResponse({ status: 404, description: 'RSVP not found' })
  @ApiResponse({ status: 400, description: 'Cannot check in cancelled or already checked in RSVP' })
  @ApiResponse({ status: 403, description: 'Not authorized - Organizer only' })
  async checkIn(@Request() req, @Param('id') id: string) {
    return this.rsvpsService.checkIn(id, req.user.userId);
  }
}
