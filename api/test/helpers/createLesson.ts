import { prisma } from '../initializers/prisma';

export const createLesson = async (data, structureName: string) => {
  const { id: lessonStructureId } = await prisma.lessonStructure.findUnique({
    where: { name: structureName },
  });
  return await prisma.lesson.create({
    data: {
      ...data,
      lessonStructureId,
    },
  });
};
