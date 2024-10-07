import { Global, Module } from '@nestjs/common';

import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';

@Global()
@Module({
  exports: [PromptService],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}
