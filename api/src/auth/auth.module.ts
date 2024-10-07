import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../common/strategies';
import { TokensService } from './tokens.service';
import { AuthController } from './auth.controller';
import { AuthLocalService } from './auth-local.service';
import { AuthGoogleService } from './auth-google.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    TokensService,
    AuthLocalService,
    AuthGoogleService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
