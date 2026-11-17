import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/database/prisma.service.js';

describe('Authentication and tenant isolation', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();
  });
  afterAll(() => app.close());

  it('registers, logs in, reads me, and logs out with an HttpOnly cookie', async () => {
    const agent = request.agent(app.getHttpServer());
    const register = await agent.post('/auth/register').send({
      businessName: 'Tenant A', businessType: 'Retail', name: 'Owner A', email: 'owner-a@test.local', password: 'password123',
    }).expect(201);
    expect(register.headers['set-cookie'][0]).toContain('HttpOnly');
    await agent.get('/auth/me').expect(200).expect(({ body }) => expect(body.email).toBe('owner-a@test.local'));
    await agent.post('/auth/logout').expect(204);
    await agent.get('/auth/me').expect(401);
  });

  it('does not expose products across businesses', async () => {
    const a = request.agent(app.getHttpServer());
    const b = request.agent(app.getHttpServer());
    await a.post('/auth/login').send({ email: 'owner-a@test.local', password: 'password123' }).expect(200);
    await b.post('/auth/register').send({ businessName: 'Tenant B', businessType: 'Retail', name: 'Owner B', email: 'owner-b@test.local', password: 'password123' }).expect(201);
    await a.post('/products').send({ name: 'A product', sku: 'A-1', sellingPrice: 1, stockQuantity: 2, lowStockThreshold: 1 }).expect(201);
    await b.get('/products').expect(200).expect(({ body }) => expect(body).toHaveLength(0));
  });
});
