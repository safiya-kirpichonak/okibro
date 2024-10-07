import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { CronModule } from './cron/cron.module';
import { AuthModule } from './auth/auth.module';
import { AudioModule } from './audio/audio.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { PromptModule } from './prompt/prompt.module';
import { LessonModule } from './lesson/lesson.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    StatisticModule,
    PrismaModule,
    PromptModule,
    LessonModule,
    AudioModule,
    RolesModule,
    UsersModule,
    AuthModule,
    CronModule,
  ],
})
export class AppModule {}
