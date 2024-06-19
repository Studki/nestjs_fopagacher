import { Test, TestingModule } from '@nestjs/testing';
import { AlimentController } from './aliment.controller';
import { AlimentsService } from './aliment.service';
import { aliment_entity } from './entities/aliment.entity';

describe('AlimentController', () => {
  let controller: AlimentController;
  let service: AlimentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlimentController],
      providers: [
        {
          provide: AlimentsService,
          useValue: {
            getAllAliments: jest.fn(),
            getOneAliment: jest.fn(),
            createAliment: jest.fn(),
            updateAliment: jest.fn(),
            deleteAliment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlimentController>(AlimentController);
    service = module.get<AlimentsService>(AlimentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllAliment', () => {
    it('should return an array of aliments', async () => {
      const result: aliment_entity[] = [];
      jest
        .spyOn(service, 'getAllAliments')
        .mockImplementation(async () => result);
      expect(await controller.getAllAliment()).toBe(result);
    });
  });

  describe('getOneAliment', () => {
    it('should return an aliment', async () => {
      const result: aliment_entity = {
        id: '1',
        title: 'test',
        description: 'test',
        price: 100,
        image: 'test',
        category: 'test',
        tag: 'test',
        items: [],
        recipes: [],
        unit: 'test',
      };
      jest
        .spyOn(service, 'getOneAliment')
        .mockImplementation(async () => result);
      expect(await controller.getOneAliment('1')).toBe(result);
    });
  });

  describe('createAliment', () => {
    it('should return an aliment', async () => {
      const result: aliment_entity = {
        id: '1',
        title: 'test',
        description: 'test',
        price: 100,
        image: 'test',
        category: 'test',
        tag: 'test',
        items: [],
        recipes: [],
        unit: 'test',
      };
      jest
        .spyOn(service, 'createAliment')
        .mockImplementation(async () => result);
      expect(await controller.createAliment(result)).toBe(result);
    });
  });

  describe('updateAliment', () => {
    it('should return an aliment', async () => {
      const result: aliment_entity = {
        id: '1',
        title: 'test',
        description: 'test',
        price: 100,
        image: 'test',
        category: 'test',
        tag: 'test',
        items: [],
        recipes: [],
        unit: 'test',
      };
      jest
        .spyOn(service, 'updateAliment')
        .mockImplementation(async () => result);
      expect(await controller.updateAliment('1', result)).toBe(result);
    });
  });

  describe('deleteAliment', () => {
    it('should return an aliment', async () => {
      const result: aliment_entity = {
        id: '1',
        title: 'test',
        description: 'test',
        price: 100,
        image: 'test',
        category: 'test',
        tag: 'test',
        items: [],
        recipes: [],
        unit: 'test',
      };
      jest
        .spyOn(service, 'deleteAliment')
        .mockImplementation(async () => result);
      expect(await controller.deleteAliment('1')).toBe(result);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
