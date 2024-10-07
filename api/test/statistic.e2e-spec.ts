import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpServer } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { createUser } from './helpers/createUser';
import { createLesson } from './helpers/createLesson';
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

  describe('statistic', () => {
    describe('GET /statistic/reports', () => {
      describe('correct case', () => {
        it('all data exists', async () => {
          const { userId, tokens } = await createUser('admin', 'statistic1');
          await createLesson(
            { userId, status: 'completed', createdAt: new Date('2002-08-18') },
            'infinity-conversation-lesson',
          );
          await createLesson(
            { userId, status: 'completed', createdAt: new Date('2002-08-18') },
            'universal-expressions-lesson',
          );
          await createLesson(
            { userId, status: 'completed', createdAt: new Date('2002-08-18') },
            'phrasal-verbs-lesson',
          );
          await createLesson(
            { userId, status: 'completed', createdAt: new Date('2002-08-18') },
            'wise-proverbs-lesson',
          );
          const { status, body } = await request(httpServer)
            .get('/statistic/reports?days[]=2002-08-18&days[]=2002-08-19')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: expect.arrayContaining([
              {
                day: '2002-08-18T00:00:00.000Z',
                creditsInfinityConversationLesson: 1,
                creditsUniversalExpressionsLesson: 1,
                creditsPhrasalVerbsLesson: 1,
                creditsWiseProverbsLesson: 1,
                creditsAllClasses: 4,
              },
              {
                day: '2002-08-19T00:00:00.000Z',
                creditsInfinityConversationLesson: null,
                creditsUniversalExpressionsLesson: null,
                creditsPhrasalVerbsLesson: null,
                creditsWiseProverbsLesson: null,
                creditsAllClasses: null,
              },
            ]),
          });
        });
      });

      describe('incorrect case', () => {
        it('incorrect permissions with test user', async () => {
          const { tokens } = await createUser('student', 'statistic2');
          const { status, body } = await request(httpServer)
            .get('/statistic/reports')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.FORBIDDEN);
          expect(body).toStrictEqual({
            message: ReasonPhrases.FORBIDDEN,
            statusCode: StatusCodes.FORBIDDEN,
          });
        });

        it('request without body', async () => {
          const { tokens } = await createUser('admin', 'statistic3');
          const { status, body } = await request(httpServer)
            .get('/statistic/reports')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: [
              'days must contain no more than 3 elements',
              'days must contain at least 1 elements',
              'days must be an array',
            ],
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
      });
    });

    describe('POST /statistic/reports/download', () => {
      describe('correct cases', () => {
        it('today information', async () => {
          const { tokens } = await createUser('admin', 'statistic6');
          const { status, header } = await request(httpServer)
            .post('/statistic/reports/download')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ date: new Date() });

          expect(status).toBe(StatusCodes.OK);
          const type = header['content-type'];
          expect(type).toBe(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          );
        });
      });

      describe('incorrect cases', () => {
        it('incorrect permissions with test user', async () => {
          const { tokens } = await createUser('student', 'statistic4');
          const { status, body } = await request(httpServer)
            .post('/statistic/reports/download')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.FORBIDDEN);
          expect(body).toStrictEqual({
            message: ReasonPhrases.FORBIDDEN,
            statusCode: StatusCodes.FORBIDDEN,
          });
        });

        it('request without body', async () => {
          const { tokens } = await createUser('admin', 'statistic5');
          const { status, body } = await request(httpServer)
            .post('/statistic/reports/download')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: ['date should not be empty'],
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
      });
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
