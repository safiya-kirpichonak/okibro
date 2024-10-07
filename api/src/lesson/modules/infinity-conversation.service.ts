import { Response } from 'express';
import * as archiver from 'archiver';
import * as stream from 'node:stream';
import { Injectable } from '@nestjs/common';

import { s3 } from '../../common/aws/s3';
import { LessonWithStructure } from '../types';
import { Hash } from '../../common/helpers/hash';
import { AudioService } from '../../audio/audio.service';
import { PromptService } from '../../prompt/prompt.service';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../../common/prisma/prisma.service';

const MINUTES = 2;
const SECONDS = 60;
const MILLISECONDS = 1000;
const CONVERSATION_DURATION = MILLISECONDS * SECONDS * MINUTES;
const MAX_ERRORS_IN_ANSWER = 5;

@Injectable()
export class InfinityConversationService {
  constructor(
    private prisma: PrismaService,
    private promptService: PromptService,
    private audioService: AudioService,
    private conversationService: ConversationService,
  ) {}

  async getAnswer(
    lesson: LessonWithStructure,
    audio: Express.Multer.File,
    response: Response,
  ): Promise<any> {
    if (!lesson.settings.conversationTime)
      return this.start(lesson.id, response);

    const nowMilliseconds = new Date().getTime();
    const { conversationTime } = lesson.settings;
    const isConversationEnd =
      nowMilliseconds - conversationTime >= CONVERSATION_DURATION;

    return isConversationEnd
      ? this.review(lesson, audio, response)
      : this.conversationService.speak(lesson, audio, response);
  }

  async start(id: number, response: Response): Promise<stream.PassThrough> {
    const settings = { conversationTime: new Date().getTime() };
    const code = 'infinity-conversation';
    return await this.conversationService.start(id, code, settings, response);
  }

  async continue(
    lesson: LessonWithStructure,
    response: Response,
  ): Promise<stream.PassThrough> {
    return await this.conversationService.continue(lesson, response);
  }

  async speak(
    lesson: LessonWithStructure,
    file: Express.Multer.File,
    response: Response,
  ): Promise<stream.PassThrough> {
    return await this.conversationService.speak(lesson, file, response);
  }

  async review(
    lesson: LessonWithStructure,
    file: Express.Multer.File,
    response: Response,
  ): Promise<any> {
    const fileName = (await Hash.generateRandomBytes(24)) + '.mp3';
    await s3.client().send(s3.createOne(file.buffer, fileName));
    const userText = await this.audioService.convertSpeechToText(fileName);
    await s3.client().send(s3.deleteOne(fileName));

    let userSpeech = '';
    for (let i = 1; i < lesson.history.length; i++)
      if (lesson.history[i].role === 'user')
        userSpeech += lesson.history[i].content;
    userSpeech + userText;

    const reviewingPrompt = await this.prisma.prompt.findUnique({
      where: {
        code: 'grammar-errors-reviewing',
      },
    });
    let errors = [];
    let counter = 0;
    while (true) {
      if (counter >= MAX_ERRORS_IN_ANSWER) {
        errors = ['No gross errors were found.'];
        break;
      }
      const completion = await this.promptService.getAnswer([
        { role: 'user', content: reviewingPrompt.content + userSpeech },
      ]);
      try {
        const errorsData = JSON.parse(completion);
        if (!Array.isArray(errorsData)) throw new Error();
      } catch (error) {
        counter++;
        continue;
      }
      errors = JSON.parse(completion);
      break;
    }

    const names = [];
    for (const error of errors) {
      const fileName = (await Hash.generateRandomBytes(24)) + '.mp3';
      const audio = await this.audioService.convertTextToSpeech(error);
      await s3.client().send(s3.createOne(audio.audioContent, fileName));
      names.push(fileName);
    }

    const summingPrompt = await this.prisma.prompt.findUnique({
      where: { code: 'summarize-infinity-conversation' },
    });
    const cutDownUserSpeech = await this.promptService.getAnswer([
      { role: 'user', content: summingPrompt.content + userSpeech },
    ]);
    const conversationPrompt = await this.prisma.prompt.findFirst({
      where: { code: 'infinity-conversation' },
    });
    await this.prisma.lesson.update({
      where: {
        id: lesson.id,
      },
      data: {
        settings: { conversationTime: new Date().getTime() },
        history: [
          { role: 'user', content: conversationPrompt.content },
          {
            role: 'assistant',
            content: 'What would you like to talk about today?',
          },
          { role: 'user', content: cutDownUserSpeech },
        ],
      },
    });

    response.setHeader('Speech-Text', JSON.stringify(errors));
    response.setHeader('Lesson-Status', 'reviewing');
    response.setHeader('Content-Type', 'application/zip');
    response.setHeader('Content-Disposition', 'attachment; filename=audio.zip');
    response.setHeader(
      'Access-Control-Expose-Headers',
      'Speech-Text, Lesson-Status',
    );
    const settingsZIP = { zlib: { level: 9 } };
    const archive = archiver('zip', settingsZIP);
    for (const name of names) {
      const s3Response = await s3.client().send(s3.getOne(name));
      archive.append(s3Response.Body, { name });
      await s3.client().send(s3.deleteOne(name));
    }
    archive.pipe(response);
    archive.finalize();
    return archive;
  }
}
