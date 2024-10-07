import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { StatusCodes } from './common/helpers/http';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.get('CLIENT_URL'),
      optionsSuccessStatus: StatusCodes.OK,
      credentials: true,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(config.get('PORT'));
}

bootstrap();
