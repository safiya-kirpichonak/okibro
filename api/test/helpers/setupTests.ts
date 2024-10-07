import type { Config } from 'jest';

import { prisma } from '../initializers/prisma';
import { defaultLessonStructures } from '../../prisma/defaultData';
import { defaultPrompts, defaultRoles } from '../../prisma/defaultData';

let isFirstRun = true;

export default async (): Promise<Config> => {
  if (isFirstRun) {
    await prisma.prompt.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    await prisma.prompt.createMany({
      data: defaultPrompts,
      skipDuplicates: true,
    });
    await prisma.lessonStructure.createMany({
      data: defaultLessonStructures,
      skipDuplicates: true,
    });
    await prisma.role.createMany({
      data: defaultRoles,
      skipDuplicates: true,
    });

    isFirstRun = false;
  }
  return {};
};
