import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Tokens } from './types';
import { Hash } from '../common/helpers/hash';
import { PrismaService } from '../common/prisma/prisma.service';

const SECONDS = 60;
const HOURS = 24;
const ACCESS_MINUTES = 5;
const REFRESH_MINUTES = 60;
const ACCESS_TOKEN_LIFE_TIME = SECONDS * ACCESS_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = SECONDS * REFRESH_MINUTES * HOURS;

@Injectable()
export class TokensService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async createNewTokens(userId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
          expiresIn: REFRESH_TOKEN_LIFE_TIME,
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.config.get('REFRESH_TOKEN_SECRET'),
          expiresIn: ACCESS_TOKEN_LIFE_TIME,
        },
      ),
    ]);

    const hash = await Hash.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });

    return { accessToken, refreshToken };
  }
}
