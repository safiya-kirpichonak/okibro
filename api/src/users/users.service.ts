import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { User, Users } from './types';
import { Hash } from '../common/helpers/hash';
import { ChangePasswordDto, ChangeRoleDto } from './dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { StatusCodes, ReasonPhrases } from '../common/helpers/http';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getList(): Promise<Array<Users>> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageURL: true,
        isActive: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return await Promise.all(
      users.map(async (user) => {
        const lessons = await this.prisma.lesson.findMany({
          where: {
            userId: user.id,
            status: 'completed',
          },
        });

        return { ...user, completedLessonsCount: lessons.length };
      }),
    );
  }

  async getById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageURL: true,
        credits: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException();

    const lessons = await this.prisma.lesson.findMany({
      where: {
        userId: id,
        status: 'completed',
      },
    });

    return { ...user, completedLessonsCount: lessons.length };
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new BadRequestException();
    const isCompare = await Hash.compare(dto.oldPassword, user.password);
    if (!isCompare) throw new BadRequestException();
    const hashNewPassword = await Hash.hash(dto.newPassword);

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashNewPassword,
      },
    });

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async changeRole(id: string, dto: ChangeRoleDto): Promise<any> {
    const role = await this.prisma.role.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (!role) throw new BadRequestException();

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role: {
          connect: {
            id: role.id,
          },
        },
      },
    });

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async changeIsActiveStatus(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new BadRequestException();

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: !user.isActive,
      },
    });

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }
}
