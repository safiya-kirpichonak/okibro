import axios from 'axios';
import * as path from 'node:path';
import { Readable } from 'node:stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import textToSpeech from '@google-cloud/text-to-speech';

import { s3 } from '../common/aws/s3';

@Injectable()
export class AudioService {
  constructor(private readonly config: ConfigService) {}

  async convertTextToSpeech(text: string): Promise<any> {
    const keyFilename =
      this.config.get('NODE_ENV') === 'test'
        ? path.join(__dirname, '..', '..', this.config.get('GOOGLE_CLOUD_FILE'))
        : path.join(
            __dirname,
            '..',
            '..',
            '..',
            this.config.get('GOOGLE_CLOUD_FILE'),
          );
    const client = new textToSpeech.TextToSpeechClient({
      keyFilename,
    });

    const [response] = await client.synthesizeSpeech({
      input: { text: text },
      voice: { name: 'en-US-Wavenet-H', languageCode: 'en-US' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    return response;
  }

  async convertSpeechToText(fileName): Promise<string> {
    const s3Response = await s3.client().send(s3.getOne(fileName));
    const readableStream = Readable.from(s3Response.Body);
    const chunks = [];
    for await (const chunk of readableStream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    const formData = new FormData();
    const fileBlob = new Blob([buffer], { type: 'audio/mp3' });
    formData.append('file', fileBlob);
    formData.append('model', 'whisper-1');

    const response = await axios.post(this.config.get('OPENAI_URL'), formData, {
      headers: {
        Authorization: `Bearer ${this.config.get('OPENAI_TRANSCRIPT_KEY')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.text;
  }
}
