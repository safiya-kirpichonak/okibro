import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url:
            configService.get('NODE_ENV') === 'test'
              ? configService.get('TEST_DATABASE_URL')
              : configService.get('DATABASE_URL'),
        },
      },
    });
  }
}
