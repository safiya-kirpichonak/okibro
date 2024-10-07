import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { createUser } from './helpers/createUser';
import { checkListOfRoles } from './scheme/roles/checkData';
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

  describe('roles', () => {
    describe('GET /roles', () => {
      describe('incorrect cases', () => {
        describe('permissions', () => {
          it('test role', async () => {
            const { tokens } = await createUser('student', 'role1');
            const { status, body } = await request(httpServer)
              .get('/roles')
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
          const { tokens } = await createUser('admin', 'role2');
          const { status, body } = await request(httpServer)
            .get('/roles')
            .set('Authorization', `Bearer ${tokens.accessToken}`);

          expect(status).toBe(StatusCodes.OK);
          expect(body).toEqual({ data: checkListOfRoles });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
