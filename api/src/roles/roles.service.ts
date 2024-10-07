import { Injectable } from '@nestjs/common';

import { Role } from './types';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getList(): Promise<Array<Role>> {
    const roles = await this.prisma.role.findMany();
    return await Promise.all(
      roles.map(async ({ name }) => {
        const usersCount = await this.prisma.user.count({
          where: {
            role: {
              name,
            },
          },
        });
        return { name, count: usersCount };
      }),
    );
  }
}
