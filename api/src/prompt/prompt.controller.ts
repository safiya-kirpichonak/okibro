import {
  Res,
  Get,
  Put,
  Body,
  Post,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  SetMetadata,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { PromptService } from './prompt.service';
import { StatusCodes } from '../common/helpers/http';
import { CreateBodyDto, UpdateBodyDto } from './dto';
import { AuthByAccessTokenGuard } from '../common/guards';
@Controller('prompts')
export class PromptController {
  constructor(private PromptService: PromptService) {}

  @Get()
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getList(@Res() res: Response) {
    const prompts = await this.PromptService.getList();
    res.status(StatusCodes.OK).json({ data: prompts });
  }

  @Post()
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async create(@Res() res: Response, @Body() dto: CreateBodyDto) {
    const prompt = await this.PromptService.create(dto);
    res.status(StatusCodes.OK).json({ data: prompt });
  }

  @Put(':id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() dto: UpdateBodyDto,
  ) {
    const result = await this.PromptService.update(id, dto);
    res.status(StatusCodes.OK).json({ data: result });
  }
}
