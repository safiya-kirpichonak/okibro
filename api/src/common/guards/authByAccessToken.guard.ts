import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AuthByAccessTokenGuard extends AuthGuard('jwt-access') {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<Array<string>>(
      'roles',
      context.getHandler(),
    );
    const user = await this.prisma.user.findFirst({
      where: {
        id: request.user.sub,
      },
      include: {
        role: true,
      },
    });
    if (!roles.includes(user.role.name) || !user.isActive)
      throw new ForbiddenException();
    return request;
  }
}
