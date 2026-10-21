import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('handles a register request (/auth/register POST)', async () => {
    const email = 'test@example.com';

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email,
        password: 'password123',
      })
      .expect(201);

    const { id, name, email: resEmail, password } = res.body;
    expect(id).toBeDefined();
    expect(name).toEqual('Test User');
    expect(resEmail).toEqual(email);
    expect(password).toBeUndefined();
  });

  it('registers as a new user then gets currently logged in user (/auth/whoami GET)', async () => {
    const email = 'whoami@example.com';

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'WhoAmI User',
        email,
        password: 'password123',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    expect(cookie).toBeDefined();

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie!)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
