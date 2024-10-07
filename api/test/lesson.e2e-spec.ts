import * as path from 'node:path';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpServer } from '@nestjs/common';

import {
  checkStartPhrasalVerbsLesson,
  checkStartWiseProverbsConversation,
  checkStartUniversalExpressionsLesson,
  checkStartInfinityConversationLesson,
} from './scheme/lessons/checkData';
import { AppModule } from '../src/app.module';
import { prisma } from './initializers/prisma';
import { createUser } from './helpers/createUser';
import { defaultPrompts } from '../prisma/defaultData';
import { createLesson } from './helpers/createLesson';
import { lessonService } from './initializers/lessonService';
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

  describe('lesson', () => {
    describe('GET /lesson/status', () => {
      describe('correct case', () => {
        it('infinity-conversation-lesson start', async () => {
          const { userId, tokens } = await createUser('student', 'lesson1', 4);
          await createLesson(
            { userId, status: 'active' },
            'infinity-conversation-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'conversation',
              structure: 'infinity-conversation-lesson',
              availableStructures: expect.arrayContaining([
                'infinity-conversation-lesson',
                'universal-expressions-lesson',
                'phrasal-verbs-lesson',
                'wise-proverbs-lesson',
              ]),
            },
          });
        });

        it('phrasal-verbs-lesson start', async () => {
          const { userId, tokens } = await createUser('student', 'lesson2', 1);
          await createLesson(
            { userId, status: 'active' },
            'phrasal-verbs-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'conversation',
              structure: 'phrasal-verbs-lesson',
              availableStructures: expect.arrayContaining([
                'infinity-conversation-lesson',
                'universal-expressions-lesson',
                'phrasal-verbs-lesson',
                'wise-proverbs-lesson',
              ]),
            },
          });
        });

        it('wise-proverbs-lesson start', async () => {
          const { userId, tokens } = await createUser('student', 'lesson25', 1);
          await createLesson(
            { userId, status: 'active' },
            'wise-proverbs-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'conversation',
              structure: 'wise-proverbs-lesson',
              availableStructures: expect.arrayContaining([
                'infinity-conversation-lesson',
                'universal-expressions-lesson',
                'phrasal-verbs-lesson',
                'wise-proverbs-lesson',
              ]),
            },
          });
        });

        it('universal-expressions-lesson start', async () => {
          const { userId, tokens } = await createUser('student', 'lesson30', 1);
          await createLesson(
            { userId, status: 'active' },
            'universal-expressions-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'conversation',
              structure: 'universal-expressions-lesson',
              availableStructures: expect.arrayContaining([
                'infinity-conversation-lesson',
                'universal-expressions-lesson',
                'phrasal-verbs-lesson',
                'wise-proverbs-lesson',
              ]),
            },
          });
        });

        it('summarizing in infinity-conversation-lesson', async () => {
          const createdAt = new Date(new Date().getTime() - 16 * 60000);
          const { userId, tokens } = await createUser('student', 'lesson6');
          await createLesson(
            { userId, status: 'active', createdAt },
            'infinity-conversation-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'summarizing',
              structure: 'infinity-conversation-lesson',
              availableStructures: expect.any(Array),
            },
          });
        });

        it('summarizing in phrasal-verbs-lesson', async () => {
          const createdAt = new Date(new Date().getTime() - 16 * 60000);
          const { userId, tokens } = await createUser('student', 'lesson7');
          await createLesson(
            { userId, status: 'active', createdAt },
            'phrasal-verbs-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'summarizing',
              structure: 'phrasal-verbs-lesson',
              availableStructures: expect.any(Array),
            },
          });
        });

        it('summarizing in wise-proverbs-lesson', async () => {
          const createdAt = new Date(new Date().getTime() - 16 * 60000);
          const { userId, tokens } = await createUser('student', 'lesson26');
          await createLesson(
            { userId, status: 'active', createdAt },
            'wise-proverbs-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'summarizing',
              structure: 'wise-proverbs-lesson',
              availableStructures: expect.any(Array),
            },
          });
        });

        it('summarizing in wise-proverbs-lesson', async () => {
          const createdAt = new Date(new Date().getTime() - 16 * 60000);
          const { userId, tokens } = await createUser('student', 'lesson29');
          await createLesson(
            { userId, status: 'active', createdAt },
            'universal-expressions-lesson',
          );

          const { status, body } = await request(httpServer)
            .get('/lesson/status')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: {
              status: 'summarizing',
              structure: 'universal-expressions-lesson',
              availableStructures: expect.any(Array),
            },
          });
        });
      });
    });

    describe('POST /lesson', () => {
      describe('correct case', () => {
        it('infinity-conversation-lesson', async () => {
          const { userId, tokens } = await createUser('student', 'lesson8');
          const { status, body, headers } = await request(httpServer)
            .post('/lesson')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ structure: 'infinity-conversation-lesson' });

          expect(status).toBe(StatusCodes.OK);
          const lessonStructure = await prisma.lessonStructure.findUnique({
            where: { name: 'infinity-conversation-lesson' },
          });
          const lesson = await prisma.lesson.findFirst({ where: { userId } });
          expect(lesson.lessonStructureId).toBe(lessonStructure.id);
          expect(lesson).toStrictEqual(checkStartInfinityConversationLesson);
          expect(headers['lesson-status']).toBe('conversation');
          expect(headers['speech-text']).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
        });

        it('phrasal-verbs-lesson', async () => {
          const { userId, tokens } = await createUser('student', 'lesson9');
          const { status, body, headers } = await request(httpServer)
            .post('/lesson')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ structure: 'phrasal-verbs-lesson' });

          expect(status).toBe(StatusCodes.OK);
          const lessonStructure = await prisma.lessonStructure.findUnique({
            where: { name: 'phrasal-verbs-lesson' },
          });
          const lesson = await prisma.lesson.findFirst({ where: { userId } });
          expect(lesson.lessonStructureId).toStrictEqual(lessonStructure.id);
          expect(lesson).toStrictEqual(checkStartPhrasalVerbsLesson);
          expect(headers['lesson-status']).toBe('conversation');
          expect(headers['speech-text']).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
        });

        it('wise-proverbs-lesson', async () => {
          const { userId, tokens } = await createUser('student', 'lesson27');
          const { status, body, headers } = await request(httpServer)
            .post('/lesson')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ structure: 'wise-proverbs-lesson' });

          expect(status).toBe(StatusCodes.OK);
          const lessonStructure = await prisma.lessonStructure.findUnique({
            where: { name: 'wise-proverbs-lesson' },
          });
          const lesson = await prisma.lesson.findFirst({ where: { userId } });
          expect(lesson.lessonStructureId).toStrictEqual(lessonStructure.id);
          expect(lesson).toStrictEqual(checkStartWiseProverbsConversation);
          expect(headers['lesson-status']).toBe('conversation');
          expect(headers['speech-text']).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
        });

        it('universal-expressions-lesson', async () => {
          const { userId, tokens } = await createUser('student', 'lesson31');
          const { status, body, headers } = await request(httpServer)
            .post('/lesson')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ structure: 'universal-expressions-lesson' });

          expect(status).toBe(StatusCodes.OK);
          const lessonStructure = await prisma.lessonStructure.findUnique({
            where: { name: 'universal-expressions-lesson' },
          });
          const lesson = await prisma.lesson.findFirst({ where: { userId } });
          expect(lesson.lessonStructureId).toStrictEqual(lessonStructure.id);
          expect(lesson).toStrictEqual(checkStartUniversalExpressionsLesson);
          expect(headers['lesson-status']).toBe('conversation');
          expect(headers['speech-text']).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
        });
      });

      describe('incorrect cases', () => {
        it('Not enough credits.', async () => {
          const { tokens } = await createUser('student', 'lesson24', 0);
          const { status, body } = await request(httpServer)
            .post('/lesson')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ structure: 'infinity-conversation-lesson' });
          expect(status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
          expect(body).toStrictEqual({
            statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
            message: 'Not enough credits.',
          });
        });

        it('Request with incorrect structure', async () => {
          const { tokens } = await createUser('student', 'lesson35', 0);
          const { status, body } = await request(httpServer)
            .post('/lesson')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ structure: 'blablabla' });

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            statusCode: StatusCodes.BAD_REQUEST,
            error: ReasonPhrases.BAD_REQUEST,
            message: [
              'structure must be one of the following values: infinity-conversation-lesson, universal-expressions-lesson, wise-proverbs-lesson, phrasal-verbs-lesson',
            ],
          });
        });
      });
    });

    describe('POST /lesson/teach', () => {
      describe('incorrect cases', () => {
        it('request with no file', async () => {
          const { tokens } = await createUser('student', 'lesson12');
          const { status, body } = await request(httpServer)
            .post('/lesson/teach')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data');

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'No file detected',
          });
        });
        it('request with incorrect extension', async () => {
          const { tokens } = await createUser('student', 'lesson13');
          const speechPath = path.join(
            __dirname,
            'audio-test-static',
            'incorrect-extension.wav',
          );
          const { status, body } = await request(httpServer)
            .post('/lesson/teach')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data')
            .attach('audio', speechPath);

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Incorrect extension',
          });
        });
        it('request with incorrect mime type', async () => {
          const { tokens } = await createUser('student', 'lesson14');
          const speechPath = path.join(
            __dirname,
            'audio-test-static',
            'incorrect-mime-type.mp3',
          );
          const { status, body } = await request(httpServer)
            .post('/lesson/teach')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data')
            .attach('audio', speechPath);

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Incorrect extension',
          });
        });
        it('request with incorrect file size', async () => {
          const { tokens } = await createUser('student', 'lesson15');
          const speechPath = path.join(
            __dirname,
            'audio-test-static',
            'incorrect-size.mp3',
          );
          const { status, body } = await request(httpServer)
            .post('/lesson/teach')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data')
            .attach('audio', speechPath);

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Incorrect size',
          });
        });
      });

      describe('correct cases', () => {
        describe('infinity-lesson', () => {
          describe('correct cases', () => {
            it('infinity conversation', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson20',
              );
              await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [
                    { role: 'user', content: defaultPrompts[0].content },
                    {
                      role: 'assistant',
                      content: 'What do you want to talk about?',
                    },
                  ],
                  settings: {
                    conversationTime: new Date().getTime(),
                  },
                },
                'infinity-conversation-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
            });

            it('grammar errors reviewing', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson21',
              );
              await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [
                    { role: 'user', content: defaultPrompts[0].content },
                    {
                      role: 'assistant',
                      content: 'What do you want to talk about?',
                    },
                    {
                      role: 'user',
                      content:
                        'I like doges and dugs and I hate New Year without Kuroki Tomoko',
                    },
                    {
                      role: 'assistant',
                      content: 'Understand...',
                    },
                  ],
                  settings: {
                    conversationTime: new Date(
                      new Date().getTime() - 3 * 60000,
                    ).getTime(),
                  },
                },
                'infinity-conversation-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { body, headers, status } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              try {
                const speechTextArray = JSON.parse(headers['speech-text']);
                expect(Array.isArray(speechTextArray)).toBe(true);
              } catch (error) {
                fail(error.message);
              }
              expect(headers['speech-text']).toBeTruthy();
              expect(headers['lesson-status']).toBe('reviewing');
              expect(body).toBeDefined();
            });

            it('summarizing', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson22',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    conversationTime: new Date().getTime(),
                  },
                  createdAt: new Date(new Date().getTime() - 50 * 60000),
                },
                'infinity-conversation-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });
              expect(user.credits).toStrictEqual(99);
              expect(lesson.status).toBe('completed');
              expect(lesson.settings).toStrictEqual({});
            });
          });
        });

        describe('phrasal-verbs-lesson', () => {
          describe('correct cases', () => {
            it('first part', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson36',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    startTime: new Date().getTime() - 60000,
                    isSecondPartStarted: false,
                    phrasalVerbs: ['string'],
                  },
                },
                'phrasal-verbs-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const { phrasalVerbs } = JSON.parse(
                JSON.stringify(lesson.settings),
              );
              expect(phrasalVerbs.length).toBe(2);
            });
            it('second part', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson37',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    startTime: new Date().getTime() - 7 * 60000,
                    isSecondPartStarted: false,
                    phrasalVerbs: ['string'],
                  },
                },
                'phrasal-verbs-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const { phrasalVerbs, isSecondPartStarted } = JSON.parse(
                JSON.stringify(lesson.settings),
              );
              expect(phrasalVerbs.length).toBe(0);
              expect(isSecondPartStarted).toBe(true);
            });
            it('summarizing', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson23',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    conversationTime: new Date().getTime(),
                  },
                  createdAt: new Date(new Date().getTime() - 50 * 60000),
                },
                'phrasal-verbs-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });
              expect(user.credits).toStrictEqual(99);
              expect(lesson.status).toBe('completed');
              expect(lesson.settings).toStrictEqual({});
            });
          });
        });

        describe('wise-proverbs-lesson', () => {
          describe('correct cases', () => {
            it('first part', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson38',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    startTime: new Date().getTime() - 60000,
                    isSecondPartStarted: false,
                    proverbs: ['string'],
                  },
                },
                'wise-proverbs-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const { proverbs } = JSON.parse(JSON.stringify(lesson.settings));
              expect(proverbs.length).toBe(2);
            });
            it('second part', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson39',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    startTime: new Date().getTime() - 7 * 60000,
                    isSecondPartStarted: false,
                    proverbs: ['string'],
                  },
                },
                'wise-proverbs-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const { proverbs, isSecondPartStarted } = JSON.parse(
                JSON.stringify(lesson.settings),
              );
              expect(proverbs.length).toBe(0);
              expect(isSecondPartStarted).toBe(true);
            });
            it('summarizing', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson28',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    conversationTime: new Date().getTime(),
                  },
                  createdAt: new Date(new Date().getTime() - 50 * 60000),
                },
                'wise-proverbs-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });
              expect(user.credits).toStrictEqual(99);
              expect(lesson.status).toBe('completed');
              expect(lesson.settings).toStrictEqual({});
            });
          });
        });

        describe('universal-expressions-lesson', () => {
          describe('correct cases', () => {
            it('first part', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson40',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    startTime: new Date().getTime() - 60000,
                    isSecondPartStarted: false,
                    expressions: ['string'],
                  },
                },
                'universal-expressions-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const { expressions } = JSON.parse(
                JSON.stringify(lesson.settings),
              );
              expect(expressions.length).toBe(2);
            });
            it('second part', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson41',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    startTime: new Date().getTime() - 7 * 60000,
                    isSecondPartStarted: false,
                    expressions: ['string'],
                  },
                },
                'universal-expressions-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              const { status, body, headers } = await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              expect(status).toBe(StatusCodes.OK);
              expect(headers['speech-text']).toBeTruthy();
              expect(body.length).toBeGreaterThan(0);
              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const { expressions, isSecondPartStarted } = JSON.parse(
                JSON.stringify(lesson.settings),
              );
              expect(expressions.length).toBe(0);
              expect(isSecondPartStarted).toBe(true);
            });
            it('summarizing', async () => {
              const { userId, tokens } = await createUser(
                'student',
                'lesson32',
              );
              const { id: lessonId } = await createLesson(
                {
                  userId,
                  status: 'active',
                  history: [],
                  settings: {
                    conversationTime: new Date().getTime(),
                  },
                  createdAt: new Date(new Date().getTime() - 50 * 60000),
                },
                'universal-expressions-lesson',
              );
              const speechPath = path.join(
                __dirname,
                'audio-test-static',
                'correct-record.mp3',
              );
              await request(httpServer)
                .post('/lesson/teach')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .field('Content-Type', 'multipart/form-data')
                .attach('audio', speechPath);

              const lesson = await prisma.lesson.findUnique({
                where: { id: lessonId },
              });
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });
              expect(user.credits).toStrictEqual(99);
              expect(lesson.status).toBe('completed');
              expect(lesson.settings).toStrictEqual({});
            });
          });
        });
      });
    });

    describe('POST /lesson/continue', () => {
      describe('correct cases', () => {
        it('infinity-lesson', async () => {
          const { userId, tokens } = await createUser('student', 'lesson33');
          await createLesson(
            { userId, status: 'active' },
            'infinity-conversation-lesson',
          );
          const { headers, status, body } = await request(httpServer)
            .post('/lesson/continue')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data');

          expect(status).toBe(StatusCodes.OK);
          expect(headers['speech-text']).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
        });

        describe('phrasal-verbs-lesson', () => {
          it('first part', async () => {
            const { userId, tokens } = await createUser('student', 'lesson43');
            const { id: lessonId } = await createLesson(
              {
                userId,
                status: 'active',
                history: [],
                settings: {
                  startTime: new Date().getTime() - 60000,
                  isSecondPartStarted: false,
                  phrasalVerbs: ['string'],
                },
              },
              'phrasal-verbs-lesson',
            );
            const { status, body, headers } = await request(httpServer)
              .post('/lesson/continue')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.OK);
            expect(headers['speech-text']).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
            const lesson = await prisma.lesson.findUnique({
              where: { id: lessonId },
            });
            const { phrasalVerbs } = JSON.parse(
              JSON.stringify(lesson.settings),
            );
            expect(phrasalVerbs.length).toBe(2);
          });
          it('second part', async () => {
            const { userId, tokens } = await createUser('student', 'lesson44');
            const { id: lessonId } = await createLesson(
              {
                userId,
                status: 'active',
                history: [],
                settings: {
                  startTime: new Date().getTime() - 7 * 60000,
                  isSecondPartStarted: false,
                  phrasalVerbs: ['string'],
                },
              },
              'phrasal-verbs-lesson',
            );
            const { status, body, headers } = await request(httpServer)
              .post('/lesson/continue')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.OK);
            expect(headers['speech-text']).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
            const lesson = await prisma.lesson.findUnique({
              where: { id: lessonId },
            });
            const { phrasalVerbs, isSecondPartStarted } = JSON.parse(
              JSON.stringify(lesson.settings),
            );
            expect(phrasalVerbs.length).toBe(0);
            expect(isSecondPartStarted).toBe(true);
          });
        });

        describe('universal-expressions-lesson', () => {
          it('first part', async () => {
            const { userId, tokens } = await createUser('student', 'lesson42');
            const { id: lessonId } = await createLesson(
              {
                userId,
                status: 'active',
                history: [],
                settings: {
                  startTime: new Date().getTime() - 60000,
                  isSecondPartStarted: false,
                  expressions: ['string'],
                },
              },
              'universal-expressions-lesson',
            );
            const { status, body, headers } = await request(httpServer)
              .post('/lesson/continue')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.OK);
            expect(headers['speech-text']).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
            const lesson = await prisma.lesson.findUnique({
              where: { id: lessonId },
            });
            const { expressions } = JSON.parse(JSON.stringify(lesson.settings));
            expect(expressions.length).toBe(2);
          });
          it('second part', async () => {
            const { userId, tokens } = await createUser('student', 'lesson47');
            const { id: lessonId } = await createLesson(
              {
                userId,
                status: 'active',
                history: [],
                settings: {
                  startTime: new Date().getTime() - 7 * 60000,
                  isSecondPartStarted: false,
                  expressions: ['string'],
                },
              },
              'universal-expressions-lesson',
            );
            const { status, body, headers } = await request(httpServer)
              .post('/lesson/continue')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.OK);
            expect(headers['speech-text']).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
            const lesson = await prisma.lesson.findUnique({
              where: { id: lessonId },
            });
            const { expressions, isSecondPartStarted } = JSON.parse(
              JSON.stringify(lesson.settings),
            );
            expect(expressions.length).toBe(0);
            expect(isSecondPartStarted).toBe(true);
          });
        });

        describe('wise-proverbs-lesson', () => {
          it('first part', async () => {
            const { userId, tokens } = await createUser('student', 'lesson45');
            const { id: lessonId } = await createLesson(
              {
                userId,
                status: 'active',
                history: [],
                settings: {
                  startTime: new Date().getTime() - 60000,
                  isSecondPartStarted: false,
                  proverbs: ['string'],
                },
              },
              'wise-proverbs-lesson',
            );
            const { status, body, headers } = await request(httpServer)
              .post('/lesson/continue')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.OK);
            expect(headers['speech-text']).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
            const lesson = await prisma.lesson.findUnique({
              where: { id: lessonId },
            });
            const { proverbs } = JSON.parse(JSON.stringify(lesson.settings));
            expect(proverbs.length).toBe(2);
          });
          it('second part', async () => {
            const { userId, tokens } = await createUser('student', 'lesson46');
            const { id: lessonId } = await createLesson(
              {
                userId,
                status: 'active',
                history: [],
                settings: {
                  startTime: new Date().getTime() - 7 * 60000,
                  isSecondPartStarted: false,
                  proverbs: ['string'],
                },
              },
              'wise-proverbs-lesson',
            );
            const { status, body, headers } = await request(httpServer)
              .post('/lesson/continue')
              .set('Authorization', `Bearer ${tokens.accessToken}`);

            expect(status).toBe(StatusCodes.OK);
            expect(headers['speech-text']).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
            const lesson = await prisma.lesson.findUnique({
              where: { id: lessonId },
            });
            const { proverbs, isSecondPartStarted } = JSON.parse(
              JSON.stringify(lesson.settings),
            );
            expect(proverbs.length).toBe(0);
            expect(isSecondPartStarted).toBe(true);
          });
        });
      });

      describe('incorrect case', () => {
        it('incorrect permissions', async () => {
          const { tokens } = await createUser('admin', 'lesson34');
          const { status } = await request(httpServer)
            .post('/lesson/continue')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data');

          expect(status).toBe(StatusCodes.FORBIDDEN);
        });
        it('no lesson', async () => {
          const { tokens } = await createUser('student', 'lesson35');
          const { status } = await request(httpServer)
            .post('/lesson/continue')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .field('Content-Type', 'multipart/form-data');

          expect(status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        });
      });
    });

    describe('./src/lesson/lesson.service.ts', () => {
      describe('getMethod', () => {
        describe('infinity-conversation', () => {
          it('infinity-conversation in infinity-conversation-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'infinity-conversation-lesson' },
            });
            const method = lessonService.getMethod(
              lessonStructure.structure,
              new Date(),
            );

            expect(method).toBe('infinity-conversation');
          });
        });

        describe('phrasal-verbs', () => {
          it('phrasal-verbs in phrasal-verbs-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'phrasal-verbs-lesson' },
            });
            const method = lessonService.getMethod(
              lessonStructure.structure,
              new Date(),
            );

            expect(method).toBe('phrasal-verbs');
          });
        });

        describe('wise-proverbs', () => {
          it('wise-proverbs in wise-proverbs-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'wise-proverbs-lesson' },
            });
            const method = lessonService.getMethod(
              lessonStructure.structure,
              new Date(),
            );

            expect(method).toBe('wise-proverbs');
          });
        });

        describe('universal-expressions-lesson', () => {
          it('universal-expressions in universal-expressions-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'universal-expressions-lesson' },
            });
            const method = lessonService.getMethod(
              lessonStructure.structure,
              new Date(),
            );

            expect(method).toBe('universal-expressions');
          });
        });

        describe('summarizing', () => {
          it('summarizing in infinity-conversation-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'infinity-conversation-lesson' },
            });
            const createdAt = new Date(new Date().getTime() - 16 * 60000);
            const method = lessonService.getMethod(
              lessonStructure.structure,
              createdAt,
            );

            expect(method).toBe('summarizing');
          });

          it('summarizing in phrasal-verbs-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'phrasal-verbs-lesson' },
            });
            const createdAt = new Date(new Date().getTime() - 16 * 60000);
            const method = lessonService.getMethod(
              lessonStructure.structure,
              createdAt,
            );

            expect(method).toBe('summarizing');
          });

          it('summarizing in wise-proverbs-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'wise-proverbs-lesson' },
            });
            const createdAt = new Date(new Date().getTime() - 16 * 60000);
            const method = lessonService.getMethod(
              lessonStructure.structure,
              createdAt,
            );

            expect(method).toBe('summarizing');
          });

          it('summarizing in universal-expressions-lesson', async () => {
            const lessonStructure = await prisma.lessonStructure.findUnique({
              where: { name: 'universal-expressions-lesson' },
            });
            const createdAt = new Date(new Date().getTime() - 16 * 60000);
            const method = lessonService.getMethod(
              lessonStructure.structure,
              createdAt,
            );

            expect(method).toBe('summarizing');
          });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
