// src/seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../App/app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.seedTags();
  await seedService.seedAllergies();
  await seedService.seedQuizzes();
  await seedService.seedDiets();
  await seedService.seedUsers();
  await app.close();
}

bootstrap();
