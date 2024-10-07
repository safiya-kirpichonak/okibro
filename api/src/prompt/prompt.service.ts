import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Prompt } from './types';
import { CreateBodyDto, UpdateBodyDto } from './dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ReasonPhrases, StatusCodes } from '../common/helpers/http';

@Injectable()
export class PromptService {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getAnswer(messages: Array<any>): Promise<string> {
    const configuration = new Configuration({
      apiKey: this.config.get('OPENAI_TRANSCRIPT_KEY'),
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    return completion.data.choices[0].message.content;
  }

  async getList(): Promise<Array<Prompt>> {
    return await this.prisma.prompt.findMany({});
  }

  async create(dto: CreateBodyDto): Promise<Prompt> {
    return await this.prisma.prompt.create({
      data: {
        content: dto.content,
        code: dto.code,
      },
    });
  }

  async update(id: number, dto: UpdateBodyDto): Promise<any> {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!prompt) throw new BadRequestException();
    await this.prisma.prompt.update({
      where: { id: Number(id) },
      data: {
        content: dto.content,
      },
    });
    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }
}
