import { Test } from '@nestjs/testing';
import { AppModule } from './App/app.module';
import { NestFactory } from '@nestjs/core';

describe('Main', () => {
  let app;

  beforeAll(async () => {
    try {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleRef.createNestApplication();
      await app.init();
    } catch (error) {
      console.error('Error during app initialization:', error);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start the application', () => {
    expect(app).toBeDefined();
  });
});
