import {
  Res,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  SetMetadata,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { StatusCodes } from '../common/helpers/http';
import { StatisticService } from './statistic.service';
import { AuthByAccessTokenGuard } from '../common/guards';
import { DownloadReportsBody, GetReportsQuery } from './dto';

@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get('/reports')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getReports(@Query() dto: GetReportsQuery, @Res() res: Response) {
    const reports = await this.statisticService.getReports(dto.days);
    res.status(StatusCodes.OK).json({ data: reports });
  }

  @Post('/reports/download')
  @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async downloadReports(
    @Body() dto: DownloadReportsBody,
    @Res() res: Response,
  ) {
    const { file, name } = await this.statisticService.downloadReports(
      dto.date,
    );
    res.attachment(name);
    res.setHeader('Access-Control-Expose-Headers', 'content-disposition');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.status(StatusCodes.OK).send(file);
  }
}
