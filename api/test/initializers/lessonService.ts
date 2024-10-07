import { ConfigService } from '@nestjs/config';

import { AudioService } from '../../src/audio/audio.service';
import { PromptService } from '../../src/prompt/prompt.service';
import { LessonService } from '../../src/lesson/lesson.service';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import {
  ConversationService,
  InfinityConversationService,
  PhrasalVerbsConversationService,
  WiseProverbsConversationService,
  UniversalExpressionsConversationService,
} from '../../src/lesson/modules';

const config = new ConfigService();
const prisma = new PrismaService(config);
const audioService = new AudioService(config);
const promptService = new PromptService(config, prisma);

const conversationService = new ConversationService(
  prisma,
  promptService,
  audioService,
);

const infinityConversationService = new InfinityConversationService(
  prisma,
  promptService,
  audioService,
  conversationService,
);

const phrasalVerbsConversationService = new PhrasalVerbsConversationService(
  prisma,
  audioService,
  promptService,
  conversationService,
);

const wiseProverbsConversationService = new WiseProverbsConversationService(
  prisma,
  audioService,
  promptService,
  conversationService,
);

const universalExpressionsConversationService =
  new UniversalExpressionsConversationService(
    prisma,
    audioService,
    promptService,
    conversationService,
  );

export const lessonService = new LessonService(
  prisma,
  infinityConversationService,
  wiseProverbsConversationService,
  phrasalVerbsConversationService,
  universalExpressionsConversationService,
);
