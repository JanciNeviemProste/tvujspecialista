import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  PORT: number = 3001;

  // Database - optional with dev defaults
  @IsString()
  @IsOptional()
  DATABASE_HOST: string = 'localhost';

  @IsNumber()
  DATABASE_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DATABASE_USER: string = 'tvujspecialista';

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD: string = 'password';

  @IsString()
  @IsOptional()
  DATABASE_NAME: string = 'tvujspecialista';

  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

  // JWT - optional with dev defaults
  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'dev-secret-change-in-production';

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET: string = 'dev-secret-change-in-production';

  @IsString()
  @IsOptional()
  JWT_EXPIRATION?: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRATION?: string = '7d';

  // Frontend
  @IsString()
  FRONTEND_URL: string = 'http://localhost:3000';

  // SendGrid - optional
  @IsString()
  @IsOptional()
  SENDGRID_API_KEY?: string;

  @IsString()
  @IsOptional()
  SENDGRID_FROM_EMAIL?: string;

  @IsString()
  @IsOptional()
  SENDGRID_FROM_NAME?: string;

  // Stripe - optional
  @IsString()
  @IsOptional()
  STRIPE_SECRET_KEY?: string;

  @IsString()
  @IsOptional()
  STRIPE_WEBHOOK_SECRET?: string;

  @IsString()
  @IsOptional()
  STRIPE_BASIC_PRICE_ID?: string;

  @IsString()
  @IsOptional()
  STRIPE_PRO_PRICE_ID?: string;

  @IsString()
  @IsOptional()
  STRIPE_PREMIUM_PRICE_ID?: string;

  @IsString()
  @IsOptional()
  STRIPE_EDUCATION_PRICE_ID?: string;

  @IsString()
  @IsOptional()
  STRIPE_MARKETPLACE_PRICE_ID?: string;

  @IsString()
  @IsOptional()
  STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID?: string;

  // Cloudinary - optional
  @IsString()
  @IsOptional()
  CLOUDINARY_CLOUD_NAME?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_KEY?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_SECRET?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
