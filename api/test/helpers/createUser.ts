import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { prisma } from '../initializers/prisma';
import { Hash } from '../../src/common/helpers/hash';
import { TokensService } from '../../src/auth/tokens.service';

const jwt = new JwtService();
const config = new ConfigService();
const tokensService = new TokensService(prisma, config, jwt);

export const createUser = async (
  roleName: string,
  email: string,
  credits?: number,
) => {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });
  const { id: userId } = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'name',
      isActive: true,
      credits: typeof credits === 'number' ? credits : 100,
      password: await Hash.hash('Test12345678!'),
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  });
  const tokens = await tokensService.createNewTokens(userId);

  return { userId, tokens };
};
