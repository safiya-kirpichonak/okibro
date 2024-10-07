import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokensService } from '../../src/auth/tokens.service';
import { AuthGoogleService } from '../../src/auth/auth-google.service';
import { PrismaService } from '../../src/common/prisma/prisma.service';

const jwt = new JwtService();
const config = new ConfigService();
const prisma = new PrismaService(config);
const token = new TokensService(prisma, config, jwt);
export const loginGoogle = new AuthGoogleService(prisma, config, token);
