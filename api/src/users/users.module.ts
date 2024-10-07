import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../common/strategies';

@Module({
  providers: [UsersService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
