import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppModule', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot(
      ), 
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          ...configService.get('database'),
        }),
      }),
    ],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
  }, 50000);

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });
});