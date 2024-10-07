import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { prisma } from './initializers/prisma';
import { createUser } from './helpers/createUser';
import { Hash } from '../src/common/helpers/hash';
import { setupAppForTest } from './initializers/setupAppForTest';
import { checkListOfUsers, checkUser } from './scheme/users/checkData';
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

  describe('users', () => {
    describe('GET /users', () => {
      describe('incorrect cases', () => {
        describe('permissions', () => {
          it('student role', async () => {
            const { tokens } = await createUser('student', 'user1');
            const { status, body } = await request(httpServer)
              .get('/users')
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
          const { tokens } = await createUser('admin', 'user2');
          const { status, body } = await request(httpServer)
            .get('/users')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toEqual({ data: checkListOfUsers });
        });
      });
    });

    describe('GET /users/get', () => {
      describe('correct case', () => {
        it('admin role', async () => {
          const { tokens } = await createUser('admin', 'user3');
          const { status, body } = await request(httpServer)
            .get('/users/get')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toEqual({ data: checkUser });
        });
      });
    });

    describe('PUT /users/password', () => {
      describe('correct cases', () => {
        it('correct', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'student',
            },
          });
          const { id } = await prisma.user.upsert({
            where: { email: 'users-password-id-student@gmail.com' },
            update: {},
            create: {
              email: 'users-password-id-student@gmail.com',
              name: 'users-password-id-student@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const newPassword = 'Test12345678!Test';
          const { tokens } = await createUser(
            'admin',
            'users-password-id-student@gmail.com',
          );
          const { status, body } = await request(httpServer)
            .put('/users/password')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({
              oldPassword: 'Test12345678!',
              newPassword,
            });

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: { status: StatusCodes.OK, message: ReasonPhrases.OK },
          });
          const user = await prisma.user.findUnique({
            where: {
              id,
            },
          });
          expect(await Hash.compare(newPassword, user.password)).toBe(true);
        });
      });

      describe('incorrect cases', () => {
        it('validation error', async () => {
          const { tokens } = await createUser('student', 'users1');
          const { status, body } = await request(httpServer)
            .put('/users/password')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({});

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: [
              'oldPassword is not strong enough',
              'oldPassword must be shorter than or equal to 20 characters',
              'oldPassword should not be empty',
              'newPassword is not strong enough',
              'newPassword must be shorter than or equal to 20 characters',
              'newPassword should not be empty',
            ],
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });

        it('incorrect old password error', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'student',
            },
          });
          await prisma.user.upsert({
            where: { email: 'users-password-id-student@gmail.com' },
            update: {},
            create: {
              email: 'users-password-id-student@gmail.com',
              name: 'users-password-id-student@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const newPassword = 'Test12345678!Test';
          const { tokens } = await createUser(
            'admin',
            'users-password-id-student@gmail.com',
          );
          const { status, body } = await request(httpServer)
            .put('/users/password')
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ oldPassword: 'Test12345678!', newPassword });

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
      });
    });

    describe('PUT /users/role/:id', () => {
      describe('correct cases', () => {
        it('correct role', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'admin',
            },
          });
          const { id } = await prisma.user.upsert({
            where: { email: 'users-role-id-admin@gmail.com' },
            update: {},
            create: {
              email: 'users-role-id-admin@gmail.com',
              name: 'users-role-id-admin@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { tokens } = await createUser(
            'admin',
            'users-role-id-admin@gmail.com',
          );
          const { status, body } = await request(httpServer)
            .put(`/users/role/${id}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({ name: 'student' });

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: { status: StatusCodes.OK, message: ReasonPhrases.OK },
          });
          const user = await prisma.user.findUnique({
            where: {
              id,
            },
          });
          const roleStudent = await prisma.role.findFirst({
            where: {
              name: 'student',
            },
          });
          expect(user.roleId).toBe(roleStudent.id);
        });
      });

      describe('incorrect cases', () => {
        it('validation error', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'admin',
            },
          });
          const { id } = await prisma.user.upsert({
            where: { email: 'users-role-id-admin2@gmail.com' },
            update: {},
            create: {
              email: 'users-role-id-admin2@gmail.com',
              name: 'users-role-id-admin2@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { tokens } = await createUser(
            'admin',
            'users-role-id-admin2@gmail.com',
          );
          const { status, body } = await request(httpServer)
            .put(`/users/role/${id}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`)
            .send({});

          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: [
              'name must be one of the following values: student, admin',
              'name should not be empty',
            ],
            error: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });
      });
    });

    describe('PUT /users/is-active/:id', () => {
      describe('correct cases', () => {
        it('correct credentials', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'admin',
            },
          });
          await prisma.user.upsert({
            where: { email: 'users-role-id-admin1@gmail.com' },
            update: {},
            create: {
              email: 'users-is-active-id-admin1@gmail.com',
              name: 'users-is-active-id-admin1@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { tokens } = await createUser(
            'admin',
            'users-is-active-id-admin1@gmail.com',
          );
          const { id: mainAdminId2 } = await prisma.user.upsert({
            where: { email: 'users-role-id-admin2@gmail.com' },
            update: {},
            create: {
              email: 'users-is-active-id-admin2@gmail.com',
              name: 'users-is-active-id-admin2@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { status, body } = await request(httpServer)
            .put(`/users/is-active/${mainAdminId2}`)
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toStrictEqual({
            data: { status: StatusCodes.OK, message: ReasonPhrases.OK },
          });
          const user = await prisma.user.findUnique({
            where: {
              id: mainAdminId2,
            },
          });
          expect(user.isActive).toBe(false);
        });
      });

      describe('incorrect cases', () => {
        it('not found error', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'admin',
            },
          });
          await prisma.user.upsert({
            where: { email: 'users-role-id-admin4@gmail.com' },
            update: {},
            create: {
              email: 'users-is-active-id-admin4@gmail.com',
              name: 'users-is-active-id-admin4@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { tokens } = await createUser(
            'admin',
            'users-is-active-id-admin4@gmail.com',
          );

          const { status, body } = await request(httpServer)
            .put('/users/is-active/emty-id')
            .set('Authorization', `Bearer ${tokens.accessToken}`);
          expect(status).toBe(StatusCodes.BAD_REQUEST);
          expect(body).toStrictEqual({
            message: ReasonPhrases.BAD_REQUEST,
            statusCode: StatusCodes.BAD_REQUEST,
          });
        });

        it('permission error', async () => {
          const role = await prisma.role.findUnique({
            where: {
              name: 'student',
            },
          });
          const { id } = await prisma.user.upsert({
            where: { email: 'users-role-id-admin3@gmail.com' },
            update: {},
            create: {
              email: 'users-is-active-id-admin3@gmail.com',
              name: 'users-is-active-id-admin3@gmail.com',
              isActive: true,
              password: await Hash.hash('Test12345678!'),
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          });
          const { tokens } = await createUser(
            'student',
            'users-is-active-id-admin3@gmail.com',
          );
          const { status, body } = await request(httpServer)
            .put('/users/is-active/emty-id')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.FORBIDDEN);
          expect(body).toStrictEqual({
            message: ReasonPhrases.FORBIDDEN,
            statusCode: StatusCodes.FORBIDDEN,
          });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
