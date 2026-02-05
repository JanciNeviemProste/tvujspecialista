import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Specialist } from './entities/specialist.entity';
import { Lead } from './entities/lead.entity';
import { Deal } from './entities/deal.entity';
import { LeadEvent } from './entities/lead-event.entity';
import { Review } from './entities/review.entity';
import { ReviewToken } from './entities/review-token.entity';
import { Subscription } from './entities/subscription.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { Commission } from './entities/commission.entity';
// Academy entities
import { Course } from './entities/course.entity';
import { Module as CourseModule } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';
import { Video } from './entities/video.entity';
import { Enrollment } from './entities/enrollment.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
// Community entities
import { Event } from './entities/event.entity';
import { RSVP } from './entities/rsvp.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          User,
          Specialist,
          Lead,
          Deal,
          LeadEvent,
          Review,
          ReviewToken,
          Subscription,
          RefreshToken,
          Commission,
          // Academy entities
          Course,
          CourseModule,
          Lesson,
          Video,
          Enrollment,
          LessonProgress,
          // Community entities
          Event,
          RSVP,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
