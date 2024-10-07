import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import {
  defaultRoles,
  defaultPrompts,
  defaultLessonStructures,
} from './defaultData';
import { Hash } from '../src/common/helpers/hash';

const config = new ConfigService();
const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    defaultLessonStructures.map(async (lessonStructure) => {
      await prisma.lessonStructure.upsert({
        where: { name: lessonStructure.name },
        update: lessonStructure,
        create: lessonStructure,
      });
    }),
  );

  await Promise.all(
    defaultPrompts.map(async (prompt) => {
      await prisma.prompt.upsert({
        where: { code: prompt.code },
        create: prompt,
        update: {},
      });
    }),
  );
  const codes = defaultPrompts.map(({ code }) => code);
  await prisma.prompt.deleteMany({
    where: {
      code: {
        notIn: codes,
      },
    },
  });

  await prisma.role.createMany({
    data: defaultRoles,
    skipDuplicates: true,
  });

  const adminRole = await prisma.role.findFirst({
    where: {
      name: 'admin',
    },
  });
  const studentRole = await prisma.role.findFirst({
    where: {
      name: 'student',
    },
  });

  const emailAdmin = config.get('ADMIN_EMAIL');
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: emailAdmin,
    },
  });

  if (!existingAdmin && adminRole) {
    const name = config.get('ADMIN_NAME');
    const password = config.get('ADMIN_PASSWORD');
    const passwordHash = await Hash.hash(password);

    await prisma.user.create({
      data: {
        name,
        email: emailAdmin,
        password: passwordHash,
        isActive: true,
        role: {
          connect: {
            id: adminRole.id,
          },
        },
      },
    });
  }

  const emailStudent = config.get('STUDENT_EMAIL');
  const existingStudent = await prisma.user.findFirst({
    where: {
      email: emailStudent,
    },
  });

  if (!existingStudent && studentRole) {
    const name = config.get('STUDENT_NAME');
    const password = config.get('STUDENT_PASSWORD');
    const passwordHash = await Hash.hash(password);

    await prisma.user.create({
      data: {
        name,
        email: emailStudent,
        password: passwordHash,
        isActive: true,
        role: {
          connect: {
            id: studentRole.id,
          },
        },
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
