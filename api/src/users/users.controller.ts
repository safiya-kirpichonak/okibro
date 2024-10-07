import {
  Res,
  Req,
  Get,
  Put,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import { UsersService } from './users.service';
import { StatusCodes } from '../common/helpers/http';
import { ChangePasswordDto, ChangeRoleDto } from './dto';
import { AuthByAccessTokenGuard } from '../common/guards';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getList(@Res() res: Response) {
    const users = await this.usersService.getList();
    res.status(StatusCodes.OK).json({ data: users });
  }

  @Get('get')
  @SetMetadata('roles', ['student', 'admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async get(@Req() req: Request, @Res() res: Response) {
    const user = await this.usersService.getById(req.user['sub']);
    res.status(StatusCodes.OK).json({ data: user });
  }

  @Put('password')
  @SetMetadata('roles', ['student'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  async changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: ChangePasswordDto,
  ) {
    const result = await this.usersService.changePassword(req.user['sub'], dto);
    res.status(StatusCodes.OK).json({ data: result });
  }

  @Put('role/:id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  async changeRole(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    const result = await this.usersService.changeRole(id, dto);
    res.status(StatusCodes.OK).json({ data: result });
  }

  @Put('is-active/:id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  async changeIsActiveStatus(@Param('id') id: string, @Res() res: Response) {
    const result = await this.usersService.changeIsActiveStatus(id);
    res.status(StatusCodes.OK).json({ data: result });
  }
}
