import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { prisma } from './initializers/prisma';
import { createUser } from './helpers/createUser';
import { checkListOfPrompts } from './scheme/prompts/checkData';
import { setupAppForTest } from './initializers/setupAppForTest';
import { ReasonPhrases, StatusCodes } from '../src/common/helpers/http';

describe('api', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    [app, httpServer] = await setupAppForTest(moduleFixture);
  });

  describe('prompts', () => {
    describe('GET /prompts', () => {
      describe('incorrect cases', () => {
        describe('permissions', () => {
          it('student role', async () => {
            const { tokens } = await createUser('student', 'prompt7');
            const { status, body } = await request(httpServer)
              .get('/prompts')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.FORBIDDEN);
            expect(body).toStrictEqual({
              statusCode: StatusCodes.FORBIDDEN,
              message: ReasonPhrases.FORBIDDEN,
            });
          });
        });
      });

      describe('correct case', () => {
        it('admin role', async () => {
          const { tokens } = await createUser('admin', 'prompt6');
          await prisma.prompt.upsert({
            update: {},
            where: { code: 'content-1' },
            create: { content: 'content', code: 'content-1' },
          });

          const { status, body } = await request(httpServer)
            .get('/prompts')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toEqual({ data: checkListOfPrompts });
        });
      });
    });

    describe('PUT /prompts/:id', () => {
      describe('correct cases', () => {
        it('correct', async () => {
          const { tokens } = await createUser('admin', 'prompt5');
          const { id: promptId } = await prisma.prompt.upsert({
            update: {},
            where: { code: 'content-1' },
            create: { content: 'content', code: 'content-1' },
          });

          const { status, body } = await request(httpServer)
            .put(`/prompts/${promptId}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ content: 'content new' });

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: { status: StatusCodes.OK, message: ReasonPhrases.OK },
          });
          const prompt = await prisma.prompt.findUnique({
            where: { id: promptId },
          });
          expect(prompt.content).toBe('content new');
        });
      });

      describe('incorrect cases', () => {
        it('validation error', async () => {
          const { tokens } = await createUser('admin', 'prompt3');
          const { status, body } = await request(httpServer)
            .put('/prompts/1')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ code: 'new code' });

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: [
              'content must be a string',
              'content should not be empty',
            ],
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });

        it('not found error', async () => {
          const { tokens } = await createUser('admin', 'prompt4');
          const { status, body } = await request(httpServer)
            .put('/prompts/100')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ content: 'content', code: 'content-1' });

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
      });
    });

    describe('POST /prompts', () => {
      describe('correct cases', () => {
        it('correct', async () => {
          const { tokens } = await createUser('admin', 'prompt2');
          const { status } = await request(httpServer)
            .post(`/prompts`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ content: 'content', code: 'content-3' });

          expect(status).toBe(StatusCodes.OK);
          const prompt = await prisma.prompt.findUnique({
            where: { code: 'content-3' },
          });
          expect(prompt.code).toBe('content-3');
        });
      });

      describe('incorrect cases', () => {
        it('validation error', async () => {
          const { tokens } = await createUser('admin', 'prompt1');
          const { status, body } = await request(httpServer)
            .post('/prompts')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({});

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: [
              'content must be a string',
              'content should not be empty',
              'code must be a string',
              'code should not be empty',
            ],
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
