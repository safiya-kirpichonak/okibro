import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpServer } from '@nestjs/common';

import {
  existUser,
  correctUser,
  notActiveUser,
  notActiveUserForActivating,
} from './scheme/auth/testData';
import { AppModule } from '../src/app.module';
import { prisma } from './initializers/prisma';
import { createUser } from './helpers/createUser';
import { Hash } from '../src/common/helpers/hash';
import { loginGoogle } from './initializers/googleLoginService';
import { setupAppForTest } from './initializers/setupAppForTest';
import { checkCorrectUser, checkTokens } from './scheme/auth/checkData';
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

  describe('auth', () => {
    describe('POST /auth/local/signup', () => {
      describe('incorrect cases', () => {
        describe('request with incorrect name', () => {
          const nameValues = [
            {
              title: 'name = null',
              name: null,
              message: [
                'name must be shorter than or equal to 40 characters',
                'name should not be empty',
              ],
            },
            {
              title: 'name = ""',
              name: '',
              message: ['name should not be empty'],
            },
            {
              title: 'no name',
              message: [
                'name must be shorter than or equal to 40 characters',
                'name should not be empty',
              ],
            },
          ];
          for (const { title, name, message } of nameValues) {
            it(`${title}`, async () => {
              const { status, body } = await request(httpServer)
                .post('/auth/local/signup')
                .send({
                  name,
                  email: 'trudy@gmail.com',
                  password: '!Trudy1234567!',
                });

              expect(status).toBe(StatusCodes.BAD_REQUEST);
              expect(body).toStrictEqual({
                message,
                error: ReasonPhrases.BAD_REQUEST,
                statusCode: StatusCodes.BAD_REQUEST,
              });
            });
          }
        });
        describe('request with incorrect email', () => {
          const emailValues = [
            {
              title: 'email = null',
              email: null,
              message: [
                'email must be shorter than or equal to 40 characters',
                'email must be an email',
                'email should not be empty',
              ],
            },
            {
              title: 'email = ""',
              email: '',
              message: ['email must be an email', 'email should not be empty'],
            },
            {
              title: 'no email',
              message: [
                'email must be shorter than or equal to 40 characters',
                'email must be an email',
                'email should not be empty',
              ],
            },
            {
              title: 'incorrect email',
              email: 'email',
              message: ['email must be an email'],
            },
          ];
          for (const { title, email, message } of emailValues) {
            it(`${title}`, async () => {
              const { status, body } = await request(httpServer)
                .post('/auth/local/signup')
                .send({
                  name: 'Trudy',
                  email,
                  password: '!Trudy1234567!',
                });

              expect(status).toBe(StatusCodes.BAD_REQUEST);
              expect(body).toStrictEqual({
                message,
                error: ReasonPhrases.BAD_REQUEST,
                statusCode: StatusCodes.BAD_REQUEST,
              });
            });
          }
          it('request with exist email', async () => {
            const role = await prisma.role.findUnique({
              where: {
                name: 'student',
              },
            });
            const { email, name, password, isActive } = existUser;
            await prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                name,
                isActive,
                password: await Hash.hash(password),
                role: {
                  connect: {
                    id: role.id,
                  },
                },
              },
            });

            const { status, body } = await request(httpServer)
              .post('/auth/local/signup')
              .send(existUser);
            expect(status).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toStrictEqual({
              error: ReasonPhrases.BAD_REQUEST,
              message: 'Email already exists.',
              statusCode: StatusCodes.BAD_REQUEST,
            });
          });
        });
        describe('request with incorrect password', () => {
          const passwordValues = [
            {
              title: 'password = null',
              password: null,
              message: [
                'password must be shorter than or equal to 20 characters',
                'password is not strong enough',
                'password should not be empty',
              ],
            },
            {
              title: 'password = ""',
              password: '',
              message: [
                'password is not strong enough',
                'password should not be empty',
              ],
            },
            {
              title: 'no password',
              message: [
                'password must be shorter than or equal to 20 characters',
                'password is not strong enough',
                'password should not be empty',
              ],
            },
            {
              title: 'password is not strong enough',
              password: 'password',
              message: ['password is not strong enough'],
            },
          ];
          for (const { title, password, message } of passwordValues) {
            it(`${title}`, async () => {
              const { status, body } = await request(httpServer)
                .post('/auth/local/signup')
                .send({
                  name: 'Trudy',
                  email: 'trudy@gmail.com',
                  password,
                });

              expect(status).toBe(StatusCodes.BAD_REQUEST);
              expect(body).toStrictEqual({
                message,
                error: ReasonPhrases.BAD_REQUEST,
                statusCode: StatusCodes.BAD_REQUEST,
              });
            });
          }
        });
      });
      describe('correct case', () => {
        it('correct user', async () => {
          const { status } = await request(httpServer)
            .post('/auth/local/signup')
            .send(correctUser);

          expect(status).toEqual(StatusCodes.CREATED);
          const user = await prisma.user.findUnique({
            where: { email: correctUser.email },
          });
          expect(user).toEqual(checkCorrectUser);
        });
      });
    });

    describe('POST /auth/local/login', () => {
      describe('incorrect cases', () => {
        describe('request with incorrect email', () => {
          const emailValues = [
            {
              title: 'email = null',
              email: null,
              message: [
                'email must be shorter than or equal to 40 characters',
                'email must be an email',
                'email should not be empty',
              ],
            },
            {
              title: 'email = ""',
              email: '',
              message: ['email must be an email', 'email should not be empty'],
            },
            {
              title: 'no email',
              message: [
                'email must be shorter than or equal to 40 characters',
                'email must be an email',
                'email should not be empty',
              ],
            },
            {
              title: 'incorrect email',
              email: 'email',
              message: ['email must be an email'],
            },
          ];
          for (const { title, email, message } of emailValues) {
            it(`${title}`, async () => {
              const { status, body } = await request(httpServer)
                .post('/auth/local/login')
                .send({
                  email,
                  password: '!Trudy1234567!',
                });

              expect(status).toBe(StatusCodes.BAD_REQUEST);
              expect(body).toStrictEqual({
                message,
                error: ReasonPhrases.BAD_REQUEST,
                statusCode: StatusCodes.BAD_REQUEST,
              });
            });
          }
          it('request with isActive = false', async () => {
            const role = await prisma.role.findUnique({
              where: {
                name: 'student',
              },
            });
            const { email, name, password } = notActiveUser;
            await prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                name,
                password: await Hash.hash(password),
                role: {
                  connect: {
                    id: role.id,
                  },
                },
              },
            });
            const { status, body } = await request(httpServer)
              .post('/auth/local/login')
              .send({ email, password });

            expect(status).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toStrictEqual({
              message: 'Account was blocked.',
              error: ReasonPhrases.BAD_REQUEST,
              statusCode: StatusCodes.BAD_REQUEST,
            });
          });
        });
        describe('request with incorrect password', () => {
          const passwordValues = [
            {
              title: 'password = null',
              password: null,
              message: [
                'password must be shorter than or equal to 20 characters',
                'password is not strong enough',
                'password should not be empty',
              ],
            },
            {
              title: 'password = ""',
              password: '',
              message: [
                'password is not strong enough',
                'password should not be empty',
              ],
            },
            {
              title: 'no password',
              message: [
                'password must be shorter than or equal to 20 characters',
                'password is not strong enough',
                'password should not be empty',
              ],
            },
            {
              title: 'password is not strong enough',
              password: 'password',
              message: ['password is not strong enough'],
            },
          ];
          for (const { title, password, message } of passwordValues) {
            it(`${title}`, async () => {
              const { status, body } = await request(httpServer)
                .post('/auth/local/login')
                .send({
                  email: 'trudy@gmail.com',
                  password,
                });

              expect(status).toBe(StatusCodes.BAD_REQUEST);
              expect(body).toStrictEqual({
                message,
                error: ReasonPhrases.BAD_REQUEST,
                statusCode: StatusCodes.BAD_REQUEST,
              });
            });
          }

          it('request with incorrect password', async () => {
            const role = await prisma.role.findUnique({
              where: {
                name: 'student',
              },
            });
            const { email, name, password, isActive } = existUser;
            await prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                name,
                isActive,
                password: await Hash.hash(password),
                role: {
                  connect: {
                    id: role.id,
                  },
                },
              },
            });

            const { status, body } = await request(httpServer)
              .post('/auth/local/login')
              .send({ email, password: password + '1' });

            expect(status).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toStrictEqual({
              message: 'Incorrect password.',
              error: ReasonPhrases.BAD_REQUEST,
              statusCode: StatusCodes.BAD_REQUEST,
            });
          });
        });
      });

      describe('correct case', () => {
        it('correct user', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'student',
            },
          });
          const { email, name, password, isActive } = existUser;
          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              name,
              isActive,
              password: await Hash.hash(password),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { status, body } = await request(httpServer)
            .post('/auth/local/login')
            .send({ email, password });

          expect(status).toBe(StatusCodes.OK);
          expect(body).toEqual(checkTokens);
        });
      });
    });

    describe('POST /auth/local/confirm', () => {
      describe('incorrect cases', () => {
        describe('incorrect token', () => {
          it('when user with this token does not exist', async () => {
            const managementLink = await Hash.generateRandomBytes(48);
            const managementLinkHash = await Hash.hash(managementLink);
            const { status, body } = await request(httpServer)
              .post('/auth/local/confirm')
              .send({ token: managementLinkHash });

            expect(status).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toStrictEqual({
              message: ReasonPhrases.BAD_REQUEST,
              statusCode: StatusCodes.BAD_REQUEST,
            });
          });
          it('when token is empty', async () => {
            const { status, body } = await request(httpServer)
              .post('/auth/local/confirm')
              .send({});

            expect(status).toBe(StatusCodes.BAD_REQUEST);
            expect(body).toStrictEqual({
              error: ReasonPhrases.BAD_REQUEST,
              statusCode: StatusCodes.BAD_REQUEST,
              message: [
                'token must be shorter than or equal to 300 characters',
                'token should not be empty',
              ],
            });
          });
        });
      });

      describe('correct case', () => {
        it('correct token', async () => {
          const managementLink = await Hash.generateRandomBytes(48);
          const managementLinkHash = await Hash.hash(managementLink);
          const role = await prisma.role.findUnique({
            where: {
              name: 'student',
            },
          });
          const { email, name, password, isActive } =
            notActiveUserForActivating;
          const { id } = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              name,
              isActive,
              managementLink: managementLinkHash,
              password: await Hash.hash(password),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { status } = await request(httpServer)
            .post('/auth/local/confirm')
            .send({ token: managementLink });

          expect(status).toBe(StatusCodes.OK);
          const user = await prisma.user.findFirst({ where: { id } });
          expect(user.isActive).toEqual(true);
          expect(user.managementLink).toEqual(null);
        });
      });
    });

    describe('POST /auth/logout', () => {
      describe('incorrect cases', () => {
        describe('incorrect refresh token', () => {
          it('when user with this token does not exist', async () => {
            const { status, body } = await request(httpServer).post(
              '/auth/logout',
            );

            expect(status).toBe(StatusCodes.UNAUTHORIZED);
            expect(body).toStrictEqual({
              message: ReasonPhrases.UNAUTHORIZED,
              statusCode: StatusCodes.UNAUTHORIZED,
            });
          });
        });
      });

      describe('correct case', () => {
        it('correct token', async () => {
          const { userId, tokens } = await createUser('student', 'auth1');
          const { status } = await request(httpServer)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          const user = await prisma.user.findFirst({ where: { id: userId } });
          expect(user.refreshToken).toEqual(null);
        });
      });
    });

    describe('POST /auth/forgot-password/email', () => {
      describe('incorrect cases', () => {
        it('no email', async () => {
          const { status, body } = await request(httpServer)
            .post('/auth/forgot-password/email')
            .send({ email: 'coolemail@gmail.com' });

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
        it('validation error', async () => {
          const { status, body } = await request(httpServer)
            .post('/auth/forgot-password/email')
            .send({});

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: [
              'email must be shorter than or equal to 40 characters',
              'email must be an email',
              'email should not be empty',
            ],
          });
        });
      });

      describe('correct case', () => {
        it('correct token', async () => {
          const email = 'blablablaaaa777@gmail.com';
          await createUser('student', email);
          const { status } = await request(httpServer)
            .post('/auth/forgot-password/email')
            .send({ email });

          expect(status).toBe(StatusCodes.OK);
        });
      });
    });

    describe('POST /auth/forgot-password/new', () => {
      describe('incorrect cases', () => {
        it('validation error', async () => {
          const { status, body } = await request(httpServer)
            .post('/auth/forgot-password/new')
            .send({});

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: [
              'token must be shorter than or equal to 300 characters',
              'token should not be empty',
              'password must be shorter than or equal to 20 characters',
              'password is not strong enough',
              'password should not be empty',
            ],
          });
        });

        it('token is null', async () => {
          const { status, body } = await request(httpServer)
            .post('/auth/forgot-password/new')
            .send({ password: 'Test1234567!', token: null });

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
            message: [
              'token must be shorter than or equal to 300 characters',
              'token should not be empty',
            ],
          });
        });
      });

      describe('correct case', () => {
        it('correct token', async () => {
          const email = 'forgot-password-new@gmail.com';
          const managementLink = await Hash.generateRandomBytes(48);
          const managementLinkHash = await Hash.hash(managementLink);
          const role = await prisma.role.findUnique({
            where: {
              name: 'student',
            },
          });
          const { id } = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              name: 'name',
              isActive: true,
              managementLink: managementLinkHash,
              password: '11111',
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { status, body } = await request(httpServer)
            .post('/auth/forgot-password/new')
            .send({ token: managementLink, password: 'Test12345!' });

          expect(status).toBe(StatusCodes.OK);
          const user = await prisma.user.findFirst({ where: { id } });
          expect(user.password).not.toBe('11111');
        });
      });
    });

    describe('POST /auth/google/login service', () => {
      it('correct case', async () => {
        await loginGoogle.loginGoogle({
          name: 'Example',
          image: 'string',
          email: 'example@gmail.com',
        });
        const user = await prisma.user.findUnique({
          where: { email: 'example@gmail.com' },
        });
        const role = await prisma.role.findUnique({
          where: { name: 'student' },
        });
        expect(user.roleId).toBe(role.id);
        expect(user.isActive).toEqual(true);
        expect(user.name).toEqual('Example');
        expect(user.email).toEqual('example@gmail.com');
        expect(user.password).toEqual(expect.any(String));
      });

      describe('incorrect cases', () => {
        it('Account was blocked.', async () => {
          const email = 'google-login-account-was-blocked.@gmail.com';
          const role = await prisma.role.findUnique({
            where: { name: 'student' },
          });
          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              name: 'name',
              isActive: false,
              credits: 100,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          try {
            await loginGoogle.loginGoogle({
              email,
              name: 'Example',
              image: 'string',
            });
          } catch (error) {
            expect(error.message).toStrictEqual("Account was blocked.");
          }
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
