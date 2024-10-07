import { Response } from 'express';
import * as stream from 'node:stream';
import { HttpException, Injectable } from '@nestjs/common';

import { s3 } from '../../common/aws/s3';
import { LessonWithStructure } from '../types';
import { Hash } from '../../common/helpers/hash';
import { GeneralService } from './general.service';
import { AudioService } from '../../audio/audio.service';
import { PromptService } from '../../prompt/prompt.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ReasonPhrases, StatusCodes } from '../../common/helpers/http';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    private promptService: PromptService,
    private audioService: AudioService,
  ) {}

  async start(
    lessonId: number,
    promptName: string,
    lessonSettings,
    response: Response,
  ): Promise<stream.PassThrough> {
    const prompt = await this.prisma.prompt.findFirst({
      where: { code: promptName },
    });

    const messages = [{ role: 'user', content: prompt.content }];
    const answerText = GeneralService.prepareAnswer(
      await this.promptService.getAnswer(messages),
    );
    messages.push({ role: 'assistant', content: answerText });

    await this.prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        history: messages,
        settings: lessonSettings,
      },
    });

    return await this.createAnswer(answerText, response);
  }

  async speak(
    lesson: LessonWithStructure,
    file: Express.Multer.File,
    response: Response,
  ): Promise<stream.PassThrough> {
    const fileName = (await Hash.generateRandomBytes(24)) + '.mp3';
    await s3.client().send(s3.createOne(file.buffer, fileName));
    const userText = await this.audioService.convertSpeechToText(fileName);
    await s3.client().send(s3.deleteOne(fileName));

    const messages = lesson.history;
    messages.push({ role: 'user', content: userText });

    const answerText = GeneralService.prepareAnswer(
      await this.promptService.getAnswer(messages),
    );
    messages.push({ role: 'assistant', content: answerText });

    await this.prisma.lesson.update({
      where: {
        id: lesson.id,
      },
      data: {
        history: messages,
      },
    });

    return await this.createAnswer(answerText, response);
  }

  async continue(
    lesson: LessonWithStructure,
    response: Response,
  ): Promise<stream.PassThrough> {
    const messages = lesson.history;
    messages.push({ role: 'user', content: 'Please continue the lesson.' });

    const answerText = GeneralService.prepareAnswer(
      await this.promptService.getAnswer(messages),
    );
    messages.push({ role: 'assistant', content: answerText });

    await this.prisma.lesson.update({
      where: {
        id: lesson.id,
      },
      data: {
        history: messages,
      },
    });

    return await this.createAnswer(answerText, response);
  }

  async createAnswer(
    answerText: string,
    response: Response,
  ): Promise<stream.PassThrough> {
    const answerAudio = await this.audioService.convertTextToSpeech(answerText);

    response.setHeader('Speech-Text', answerText);
    response.setHeader('Lesson-Status', 'conversation');
    response.setHeader('Content-Type', 'audio/mpeg');
    response.setHeader(
      'Access-Control-Expose-Headers',
      'Speech-Text, Lesson-Status',
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(answerAudio.audioContent);
    bufferStream.pipe(response);

    return bufferStream;
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
}
