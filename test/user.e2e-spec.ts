import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/App/app.module';

describe('Usercontroler (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        pseudo: 'test',
        email: 'test@test.com',
        password: '1234',
        tag: 'test',
      })
      .expect(201);
  });

  it('/users/:tag (GET)', () => {
    return request(app.getHttpServer()).get('users/test').expect(200);
  });

  it('/users/tag (PUT)', () => {
    return request(app.getHttpServer())
      .put('/users/test')
      .send({
        pseudo: 'test',
        email: 'tessst@gmail.com',
        password: '1234',
        tag: 'test',
      })
      .expect(200);
  });
});
