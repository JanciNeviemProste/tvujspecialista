// Sentry must be imported before everything else
import './instrument';

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const logger = new Logger('Bootstrap');

  // Security headers
  app.use(helmet());

  // Payload size limits (higher for video uploads)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new SanitizePipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filters (Sentry captures first, then custom filter formats response)
  app.useGlobalFilters(new SentryGlobalFilter(), new AllExceptionsFilter());

  // Global serializer (applies @Exclude() on all responses)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger documentation (disabled in production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('tvujspecialista.cz API')
      .setDescription(
        'Marketplace API for financial advisors and real estate agents',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  // Warn if using default JWT secrets in production
  if (process.env.NODE_ENV === 'production') {
    const jwtSecret = process.env.JWT_SECRET || '';
    if (!jwtSecret || jwtSecret.includes('dev-secret')) {
      logger.error('CRITICAL: JWT_SECRET is not set or using default value in production!');
      process.exit(1);
    }
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || '';
    if (!jwtRefreshSecret || jwtRefreshSecret.includes('dev-refresh-secret')) {
      logger.error('CRITICAL: JWT_REFRESH_SECRET is not set or using default value in production!');
      process.exit(1);
    }
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
}
void bootstrap();
