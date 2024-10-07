import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CronService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log('Cron start work...');
    await this.clearManagementLinksInUsers();
  }
  private async clearManagementLinksInUsers() {
    console.log('Removing management links from users table.');

    await this.prisma.user.updateMany({
      data: { managementLink: null },
      where: { managementLink: { not: null } },
    });
  }
}
