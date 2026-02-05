import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { QueryEventsDto } from '../dto/query-events.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Community - Events')
@Controller('community/events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published events' })
  @ApiResponse({ status: 200, description: 'Returns paginated event list' })
  async findAll(@Query() filters: QueryEventsDto) {
    return this.eventsService.findAll(filters);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiResponse({ status: 200, description: 'Returns upcoming published events' })
  async findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get event by slug' })
  @ApiResponse({ status: 200, description: 'Returns event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event (authenticated users)' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Request() req, @Body() dto: CreateEventDto) {
    return this.eventsService.create(req.user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event (owner only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event (owner only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete event with confirmed attendees' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
  async delete(@Request() req, @Param('id') id: string) {
    await this.eventsService.delete(id, req.user.userId);
    return { message: 'Event deleted successfully' };
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish/unpublish event (owner only)' })
  @ApiResponse({ status: 200, description: 'Event publish status updated' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Event not ready for publishing' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
  async publish(
    @Request() req,
    @Param('id') id: string,
    @Body('published') published: boolean,
  ) {
    return this.eventsService.publish(id, req.user.userId, published);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel event (owner only)' })
  @ApiResponse({ status: 200, description: 'Event cancelled and attendees notified' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Event already cancelled or completed' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
  async cancel(@Request() req, @Param('id') id: string) {
    await this.eventsService.cancel(id, req.user.userId);
    return { message: 'Event cancelled successfully' };
  }

  @Get(':id/attendees')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event attendees (owner only)' })
  @ApiResponse({ status: 200, description: 'Returns list of attendees' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
  async getAttendees(@Request() req, @Param('id') id: string) {
    return this.eventsService.getAttendees(id, req.user.userId);
  }
}
