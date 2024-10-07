import {
  Req,
  Get,
  Res,
  Post,
  Body,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { StructureDto } from './dto';
import { LessonService } from './lesson.service';
import { ValidateAudioPipe } from './lesson.pipe';
import { StatusCodes } from '../common/helpers/http';
import { AuthByAccessTokenGuard } from '../common/guards';

@Controller('lesson')
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Post()
  @SetMetadata('roles', ['student'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: StructureDto,
  ) {
    return await this.lessonService.start(req.user['sub'], dto.structure, res);
  }

  @Delete()
  @SetMetadata('roles', ['student'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @UseInterceptors(FileInterceptor('audio'))
  @HttpCode(HttpStatus.OK)
  async stop(@Req() req: Request, @Res() res: Response) {
    return await this.lessonService.stop(req.user['sub'], res);
  }

  @Get('status')
  @SetMetadata('roles', ['student'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getStatus(@Req() req: Request, @Res() res: Response) {
    const status = await this.lessonService.getStatus(req.user['sub']);
    const structure = await this.lessonService.getStructure(req.user['sub']);
    const availableStructures = await this.lessonService.getAvailableStructures(
      req.user['sub'],
    );

    res
      .status(StatusCodes.OK)
      .json({ data: { status, structure, availableStructures } });
  }

  @Post('teach')
  @SetMetadata('roles', ['student'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @UseInterceptors(FileInterceptor('audio'))
  @HttpCode(HttpStatus.OK)
  async teach(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile(new ValidateAudioPipe()) file: Express.Multer.File,
  ) {
    return await this.lessonService.teach(req.user['sub'], file, res);
  }

  @Post('continue')
  @SetMetadata('roles', ['student'])
  @UseGuards(AuthGuard('jwt-access'), AuthByAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async continue(@Req() req: Request, @Res() res: Response) {
    return await this.lessonService.continue(req.user['sub'], res);
  }
}
