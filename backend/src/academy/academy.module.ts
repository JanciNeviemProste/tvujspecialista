import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CoursesController } from './controllers/courses.controller';
import { ModulesController } from './controllers/modules.controller';
import { LessonsController } from './controllers/lessons.controller';
import { EnrollmentsController } from './controllers/enrollments.controller';
import { LessonProgressController } from './controllers/lesson-progress.controller';
import { VideosController } from './controllers/videos.controller';
import { CoursesService } from './services/courses.service';
import { ModulesService } from './services/modules.service';
import { LessonsService } from './services/lessons.service';
import { EnrollmentsService } from './services/enrollments.service';
import { LessonProgressService } from './services/lesson-progress.service';
import { VideosService } from './services/videos.service';
import { SubscriptionGuard } from './guards/subscription.guard';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Course } from '../database/entities/course.entity';
import { Module as CourseModule } from '../database/entities/module.entity';
import { Lesson } from '../database/entities/lesson.entity';
import { Video } from '../database/entities/video.entity';
import { Enrollment } from '../database/entities/enrollment.entity';
import { LessonProgress } from '../database/entities/lesson-progress.entity';
import { User } from '../database/entities/user.entity';
import { Subscription } from '../database/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseModule,
      Lesson,
      Video,
      Enrollment,
      LessonProgress,
      User,
      Subscription,
    ]),
    MulterModule.register({
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
      },
    }),
    CloudinaryModule,
  ],
  controllers: [
    CoursesController,
    ModulesController,
    LessonsController,
    EnrollmentsController,
    LessonProgressController,
    VideosController,
  ],
  providers: [
    CoursesService,
    ModulesService,
    LessonsService,
    EnrollmentsService,
    LessonProgressService,
    VideosService,
    SubscriptionGuard,
  ],
  exports: [
    CoursesService,
    ModulesService,
    LessonsService,
    EnrollmentsService,
    LessonProgressService,
    VideosService,
  ],
})
export class AcademyModule {}
