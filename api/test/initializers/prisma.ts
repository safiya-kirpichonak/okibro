import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../src/common/prisma/prisma.service';

const config = new ConfigService();
export const prisma = new PrismaService(config);
