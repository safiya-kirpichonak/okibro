import { ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { INestApplication, HttpServer } from '@nestjs/common';

export async function setupAppForTest(
  module: TestingModule,
): Promise<[INestApplication, HttpServer]> {
  const app = module.createNestApplication();
  const httpServer = app.getHttpServer();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();

  httpServer.listen(0);

  return [app, httpServer];
}
