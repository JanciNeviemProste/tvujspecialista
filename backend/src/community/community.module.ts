import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './controllers/events.controller';
import { RSVPsController } from './controllers/rsvps.controller';
import { EventsService } from './services/events.service';
import { RSVPsService } from './services/rsvps.service';
import { Event } from '../database/entities/event.entity';
import { RSVP } from '../database/entities/rsvp.entity';
import { User } from '../database/entities/user.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, RSVP, User]),
    EmailModule,
  ],
  controllers: [
    EventsController,
    RSVPsController,
  ],
  providers: [
    EventsService,
    RSVPsService,
  ],
  exports: [
    EventsService,
    RSVPsService,
  ],
})
export class CommunityModule {}
