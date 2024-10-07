import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Tokens } from './types';
import { Hash } from '../common/helpers/hash';
import { TokensService } from './tokens.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuthGoogleService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private tokensService: TokensService,
  ) {}

  async loginGoogle(userData: any): Promise<Tokens> {
    const { email, name, picture } = userData;
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const password = await Hash.generateRandomBytes(24);
      const passwordHash = await Hash.hash(password);
      const role = await this.prisma.role.findUnique({
        where: { name: this.config.get('DEFAULT_ROLE') },
      });
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          isActive: true,
          imageURL: picture,
          password: passwordHash,
          role: {
            connect: {
              id: role.id,
            },
          },
        },
      });

      return await this.tokensService.createNewTokens(user.id);
    }

    if (!user.isActive) throw new BadRequestException('Account was blocked.');

    await this.prisma.user.update({
      data: {
        imageURL: picture,
      },
      where: {
        id: user.id,
      },
    });

    return await this.tokensService.createNewTokens(user.id);
  }
}
