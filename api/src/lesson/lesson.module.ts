import { Module } from '@nestjs/common';

import {
  GeneralService,
  ConversationService,
  InfinityConversationService,
  PhrasalVerbsConversationService,
  WiseProverbsConversationService,
  UniversalExpressionsConversationService,
} from './modules';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

@Module({
  controllers: [LessonController],
  providers: [
    LessonService,
    GeneralService,
    ConversationService,
    InfinityConversationService,
    WiseProverbsConversationService,
    PhrasalVerbsConversationService,
    UniversalExpressionsConversationService,
  ],
})

export class LessonModule {}
