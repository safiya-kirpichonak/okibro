import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';

import { StatusCodes, ReasonPhrases } from '../helpers/http';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = ReasonPhrases.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      console.log(exception.message);
    }

    if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
      const config = new ConfigService();
      Sentry.init({ dsn: config.get('DSN_SENTRY') });
      Sentry.captureException(exception);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
