import {
  Res,
  Get,
  Controller,
  HttpCode,
  HttpStatus,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { RolesService } from './roles.service';
import { StatusCodes } from '../common/helpers/http';
import { AuthByAccessTokenGuard } from '../common/guards';
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getList(@Res() res: Response) {
    const roles = await this.rolesService.getList();
    res.status(StatusCodes.OK).json({ data: roles });
  }
}
