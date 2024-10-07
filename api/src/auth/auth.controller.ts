import {
  Get,
  Req,
  Res,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import {
  LoginDto,
  SignupDto,
  EmailBodyDto,
  TokenBodyDto,
  NewPasswordBodyDto,
} from './dto';
import { StatusCodes } from '../common/helpers/http';
import { AuthLocalService } from './auth-local.service';
import { AuthByAccessTokenGuard } from '../common/guards';
import { AuthGoogleService } from './auth-google.service';

const DAYS = 7;
const HOURS = 24;
const MINUTES = 60;
const SECONDS = 60;
const MILLISECONDS = 1000;
const COOKIE_LIFE_TIME = DAYS * HOURS * MINUTES * SECONDS * MILLISECONDS;

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller('auth')
export class AuthController {
  constructor(
    private authGoogleService: AuthGoogleService,
    private authLocalService: AuthLocalService,
  ) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(@Body() dto: SignupDto, @Res() res: Response) {
    const data = await this.authLocalService.signupLocal(dto);
    res.status(StatusCodes.CREATED).json(data);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async loginLocal(@Body() dto: LoginDto, @Res() res: Response) {
    const data = await this.authLocalService.loginLocal(dto);
    res.cookie('refreshToken', data.refreshToken, {
      maxAge: COOKIE_LIFE_TIME,
      httpOnly: true,
    });
    res.status(StatusCodes.OK).json(data);
  }

  @Post('local/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmAccount(@Body() dto: TokenBodyDto, @Res() res: Response) {
    const data = await this.authLocalService.confirmEmailLocal(dto.token);
    res.status(StatusCodes.OK).json(data);
  }

  @Post('logout')
  @SetMetadata('roles', ['student', 'admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const data = await this.authLocalService.logout(req.user['sub']);
    res.clearCookie('refreshToken');
    res.status(StatusCodes.OK).json(data);
  }

  @Post('forgot-password/email')
  @HttpCode(HttpStatus.OK)
  async forgotPasswordSendEmail(
    @Body() dto: EmailBodyDto,
    @Res() res: Response,
  ) {
    const data = await this.authLocalService.forgotPasswordSendEmail(dto.email);
    res.status(StatusCodes.OK).json(data);
  }

  @Post('forgot-password/new')
  @HttpCode(HttpStatus.OK)
  async forgotPasswordUpdatePassword(
    @Body() dto: NewPasswordBodyDto,
    @Res() res: Response,
  ) {
    const data = await this.authLocalService.forgotPasswordUpdatePassword(
      dto.token,
      dto.password,
    );
    res.status(StatusCodes.OK).json(data);
  }

  @Get('refresh')
  @SetMetadata('roles', ['student', 'admin'])
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const data = await this.authLocalService.refreshTokens(
      req.user['sub'],
      req.cookies.refreshToken,
    );
    res.cookie('refreshToken', data.refreshToken, {
      maxAge: COOKIE_LIFE_TIME,
      httpOnly: true,
    });
    res.status(StatusCodes.OK).json(data);
  }

  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body('token') token, @Res() res: Response) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const userData = ticket.getPayload();

    const data = await this.authGoogleService.loginGoogle(userData);
    res.cookie('refreshToken', data.refreshToken, {
      maxAge: COOKIE_LIFE_TIME,
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json(data);
  }
}
