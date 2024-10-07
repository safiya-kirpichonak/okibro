import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Payload } from '../../auth/types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies['refreshToken'],
      secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
    });
  }

  validate(payload: Payload): Payload {
    return payload;
  }
}
