import * as FileType from 'file-type';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateAudioPipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file) throw new BadRequestException('No file detected');

    const VALID_EXTENSEIONS = ['mp3'];
    const VALID_MIME_TYPES = ['audio/mpeg'];
    const VALID_SIZE = 1.5 * 1024 * 1024;

    const { ext, mime } = await FileType.fromBuffer(file.buffer);
    const { byteLength } = file.buffer;

    if (!VALID_EXTENSEIONS.includes(ext)) {
      throw new BadRequestException('Incorrect extension');
    } else if (!VALID_MIME_TYPES.includes(mime)) {
      throw new BadRequestException('Incorrect mime type');
    } else if (!(byteLength < VALID_SIZE)) {
      throw new BadRequestException('Incorrect size');
    } else return file;
  }
}
