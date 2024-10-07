import { Response } from 'express';
import * as stream from 'node:stream';
import { Injectable } from '@nestjs/common';

import { s3 } from '../../common/aws/s3';
import { LessonWithStructure } from '../types';
import { Hash } from '../../common/helpers/hash';
import { GeneralService } from './general.service';
import { AudioService } from '../../audio/audio.service';
import { PromptService } from '../../prompt/prompt.service';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as phrasalVerbs from '../../common/data/phrasalVerbs.json';

const SECONDS = 60;
const MILLISECONDS = 1000;
const FIRST_PART_MINUTES = 5;
const FIRST_PART_DURATION = MILLISECONDS * SECONDS * FIRST_PART_MINUTES;

@Injectable()
export class PhrasalVerbsConversationService {
  constructor(
    private prisma: PrismaService,
    private audioService: AudioService,
    private promptService: PromptService,
    private conversationService: ConversationService,
  ) {}

  async getAnswer(
    lesson: LessonWithStructure,
    audio: Express.Multer.File,
    response: Response,
  ): Promise<any> {
    if (!lesson.settings.startTime)
      return await this.startFirstPart(lesson, response);

    const nowMilliseconds = new Date().getTime();
    const { startTime, isSecondPartStarted } = lesson.settings;
    const isFirstPartEnd = nowMilliseconds - startTime >= FIRST_PART_DURATION;

    return isFirstPartEnd
      ? isSecondPartStarted
        ? await this.speakSecondPart(lesson, audio, response)
        : await this.startSecondPart(lesson, response)
      : await this.startFirstPart(lesson, response);
  }

  async startFirstPart(
    lesson: LessonWithStructure,
    response: Response,
  ): Promise<stream.PassThrough> {
    let { content } = await this.prisma.prompt.findFirst({
      where: { code: 'phrasal-verbs-conversation-1' },
    });
    const randomIndex = GeneralService.generateRandomIndex(phrasalVerbs.length);
    content = content.replace('DYNAMIC_PART', phrasalVerbs[randomIndex]);
    const messages = [{ role: 'user', content }];

    const answerText = GeneralService.prepareAnswer(
      await this.promptService.getAnswer(messages),
    );

    let { phrasalVerbs: phrasalVerbsSettings, startTime } = lesson.settings;
    if (phrasalVerbsSettings) {
      phrasalVerbsSettings.push(phrasalVerbs[randomIndex]);
    } else {
      phrasalVerbsSettings = [phrasalVerbs[randomIndex]];
    }
    await this.prisma.lesson.update({
      where: {
        id: lesson.id,
      },
      data: {
        settings: {
          startTime: startTime ? startTime : new Date().getTime(),
          phrasalVerbs: phrasalVerbsSettings,
          isSecondPartStarted: false,
        },
      },
    });

    return await this.conversationService.createAnswer(answerText, response);
  }

  async startSecondPart(
    lesson: LessonWithStructure,
    response: Response,
  ): Promise<stream.PassThrough> {
    let { phrasalVerbs: phrasalVerbsSettings, startTime } = lesson.settings;
    if (phrasalVerbsSettings.length === 0)
      phrasalVerbsSettings = [...phrasalVerbs.slice(0, 100)];

    let { content } = await this.prisma.prompt.findFirst({
      where: { code: 'phrasal-verbs-conversation-2' },
    });
    const randomIndex = GeneralService.generateRandomIndex(
      phrasalVerbsSettings.length,
    );
    content = content.replace(
      'DYNAMIC_PART',
      phrasalVerbsSettings[randomIndex],
    );
    phrasalVerbsSettings.splice(randomIndex, 1);
    const messages = [{ role: 'user', content }];

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
        settings: {
          startTime,
          isSecondPartStarted: true,
          phrasalVerbs: phrasalVerbsSettings,
        },
      },
    });

    return this.conversationService.createAnswer(answerText, response);
  }

  async speakSecondPart(
    lesson: LessonWithStructure,
    audio: Express.Multer.File,
    response: Response,
  ): Promise<stream.PassThrough> {
    let { phrasalVerbs: phrasalVerbsSettings, startTime } = lesson.settings;
    if (phrasalVerbsSettings.length === 0)
      phrasalVerbsSettings = [...phrasalVerbs.slice(0, 100)];

    const fileName = (await Hash.generateRandomBytes(24)) + '.mp3';
    await s3.client().send(s3.createOne(audio.buffer, fileName));
    const userText = await this.audioService.convertSpeechToText(fileName);
    await s3.client().send(s3.deleteOne(fileName));

    const randomIndex = GeneralService.generateRandomIndex(
      phrasalVerbsSettings.length,
    );
    const messages = lesson.history;
    const content = `This is my answer, and analyze only this: "${userText}".  
                     Next explain and give example for: ${phrasalVerbsSettings[randomIndex]}`;
    phrasalVerbsSettings.splice(randomIndex, 1);
    messages.push({ role: 'user', content });

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
        settings: {
          startTime,
          isSecondPartStarted: true,
          phrasalVerbs: phrasalVerbsSettings,
        },
      },
    });

    return this.conversationService.createAnswer(answerText, response);
  }

  async continue(
    lesson: LessonWithStructure,
    response: Response,
  ): Promise<stream.PassThrough> {
    const { startTime } = lesson.settings;
    const nowMilliseconds = new Date().getTime();
    const isFirstPartEnd = nowMilliseconds - startTime >= FIRST_PART_DURATION;

    return isFirstPartEnd
      ? await this.startSecondPart(lesson, response)
      : await this.startFirstPart(lesson, response);
  }
}
