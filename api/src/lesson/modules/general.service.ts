import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneralService {
  constructor() {}

  static prepareAnswer(completion: string): string {
    const invalidCharacters = /[\uD800-\uDFFF].|[\n\r]/g;
    return completion.replace(invalidCharacters, '');
  }

  static generateRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }
}
