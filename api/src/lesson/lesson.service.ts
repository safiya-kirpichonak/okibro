import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from '../common/prisma/prisma.service';
import {
  InfinityConversationService,
  WiseProverbsConversationService,
  PhrasalVerbsConversationService,
  UniversalExpressionsConversationService,
} from './modules';
import { ReasonPhrases, StatusCodes } from '../common/helpers/http';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private infinityConversationService: InfinityConversationService,
    private wiseProverbsConversationService: WiseProverbsConversationService,
    private phrasalVerbsConversationService: PhrasalVerbsConversationService,
    private universalExpressionsConversationService: UniversalExpressionsConversationService,
  ) {}

  async getStatus(userId: string): Promise<string> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        AND: [
          { userId },
          {
            status: 'active',
          },
        ],
      },
      include: {
        lessonStructure: true,
      },
    });
    if (!lesson) return 'introduction';

    const { lessonStructure, createdAt } = lesson;
    const method = this.getMethod(lessonStructure.structure, createdAt);
    switch (method) {
      case 'infinity-conversation':
      case 'universal-expressions':
      case 'phrasal-verbs':
      case 'wise-proverbs':
        return 'conversation';
      case 'summarizing':
        return 'summarizing';
      default:
        throw new HttpException(
          'Unknown strategy.',
          StatusCodes.UNPROCESSABLE_ENTITY,
        );
    }
  }

  async getStructure(userId: string): Promise<string> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        AND: [
          { userId },
          {
            status: 'active',
          },
        ],
      },
      include: {
        lessonStructure: true,
      },
    });

    return lesson ? lesson.lessonStructure.name : 'no-structure';
  }

  async getAvailableStructures(userId: string): Promise<Array<string>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const lessonStructure = await this.prisma.lessonStructure.findMany();
    const availableStructures = [];
    await Promise.all(
      lessonStructure.map(async (structure) => {
        if (user.credits - structure.credits >= 0)
          availableStructures.push(structure.name);
      }),
    );

    return availableStructures;
  }

  async teach(
    userId: string,
    audio: Express.Multer.File,
    res: Response,
  ): Promise<any> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        AND: [
          { userId },
          {
            status: 'active',
          },
        ],
      },
      include: {
        lessonStructure: true,
      },
    });

    if (!lesson)
      throw new HttpException(
        'No active lesson.',
        StatusCodes.UNPROCESSABLE_ENTITY,
      );

    const method = this.getMethod(
      lesson.lessonStructure.structure,
      lesson.createdAt,
    );
    switch (method) {
      case 'infinity-conversation':
        return await this.infinityConversationService.getAnswer(
          lesson,
          audio,
          res,
        );
      case 'phrasal-verbs':
        return await this.phrasalVerbsConversationService.getAnswer(
          lesson,
          audio,
          res,
        );
      case 'wise-proverbs':
        return await this.wiseProverbsConversationService.getAnswer(
          lesson,
          audio,
          res,
        );
      case 'universal-expressions':
        return await this.universalExpressionsConversationService.getAnswer(
          lesson,
          audio,
          res,
        );
      case 'summarizing':
        return await this.stop(userId, res);
      default:
        throw new HttpException(
          'Unknown strategy.',
          StatusCodes.UNPROCESSABLE_ENTITY,
        );
    }
  }

  async stop(userId: string, res: Response): Promise<any> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        AND: [
          { userId },
          {
            status: 'active',
          },
        ],
      },
      include: {
        lessonStructure: true,
      },
    });

    if (!lesson)
      throw new HttpException(
        'No active lesson.',
        StatusCodes.UNPROCESSABLE_ENTITY,
      );

    const { credits: lessonStructureCredits } = lesson.lessonStructure;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.prisma.user.update({
      data: { credits: user.credits - lessonStructureCredits },
      where: { id: userId },
    });

    await this.prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        status: 'completed',
        settings: {},
        history: [],
      },
    });

    res.setHeader('Lesson-Status', 'summarizing');
    res.setHeader('Access-Control-Expose-Headers', 'Lesson-Status');
    return res.status(StatusCodes.OK).json({ data: ReasonPhrases.OK });
  }

  async start(userId: string, name: string, res: Response): Promise<any> {
    const existLesson = await this.prisma.lesson.findFirst({
      where: { userId, status: 'active' },
    });
    if (existLesson)
      throw new HttpException(
        'Active lesson already exists.',
        StatusCodes.UNPROCESSABLE_ENTITY,
      );

    const structure = await this.prisma.lessonStructure.findUnique({
      where: { name },
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.credits - structure.credits < 0)
      throw new HttpException(
        'Not enough credits.',
        StatusCodes.UNPROCESSABLE_ENTITY,
      );

    const lesson = await this.prisma.lesson.create({
      data: {
        userId,
        status: 'active',
        lessonStructureId: structure.id,
      },
      include: {
        lessonStructure: true,
      },
    });

    const method = this.getMethod(structure.structure, lesson.createdAt);
    switch (method) {
      case 'infinity-conversation':
        return await this.infinityConversationService.start(lesson.id, res);
      case 'phrasal-verbs':
        return await this.phrasalVerbsConversationService.startFirstPart(
          lesson,
          res,
        );
      case 'wise-proverbs':
        return await this.wiseProverbsConversationService.startFirstPart(
          lesson,
          res,
        );
      case 'universal-expressions':
        return await this.universalExpressionsConversationService.startFirstPart(
          lesson,
          res,
        );
      default:
        throw new HttpException(
          'Unknown strategy.',
          StatusCodes.UNPROCESSABLE_ENTITY,
        );
    }
  }

  async continue(userId, res): Promise<any> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        AND: [
          { userId },
          {
            status: 'active',
          },
        ],
      },
      include: {
        lessonStructure: true,
      },
    });

    if (!lesson)
      throw new HttpException(
        'No active lesson.',
        StatusCodes.UNPROCESSABLE_ENTITY,
      );

    const method = this.getMethod(
      lesson.lessonStructure.structure,
      lesson.createdAt,
    );
    switch (method) {
      case 'infinity-conversation':
        return await this.infinityConversationService.continue(lesson, res);
      case 'phrasal-verbs':
        return await this.phrasalVerbsConversationService.continue(lesson, res);
      case 'wise-proverbs':
        return await this.wiseProverbsConversationService.continue(lesson, res);
      case 'universal-expressions':
        return await this.universalExpressionsConversationService.continue(
          lesson,
          res,
        );
      case 'summarizing':
        return await this.stop(userId, res);
      default:
        throw new HttpException(
          'Unknown strategy.',
          StatusCodes.UNPROCESSABLE_ENTITY,
        );
    }
  }

  getMethod(structure: Prisma.JsonValue, createdAt: Date): string {
    let tempMilliseconds = 0;
    const modules = JSON.parse(JSON.stringify(structure));
    for (let i = 0; i < modules.length; i++) {
      const now = new Date().getTime();
      const startTime = new Date(createdAt).getTime() + tempMilliseconds;
      if (now - startTime < modules[i].duration) {
        return modules[i].name;
      } else {
        if (i === modules.length - 1) return 'summarizing';
        tempMilliseconds += modules[i].duration;
      }
    }
  }
}
