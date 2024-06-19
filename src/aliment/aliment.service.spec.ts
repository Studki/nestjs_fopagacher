import { Test, TestingModule } from '@nestjs/testing';
import { AlimentsService } from './aliment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { aliment_entity } from './entities/aliment.entity';
import { Repository } from 'typeorm';

describe('AlimentsService', () => {
  let service: AlimentsService;
  let repo: Repository<aliment_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlimentsService,
        {
          provide: getRepositoryToken(aliment_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AlimentsService>(AlimentsService);
    repo = module.get<Repository<aliment_entity>>(
      getRepositoryToken(aliment_entity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAliment', () => {
    it('should successfully insert a aliment', async () => {
      const alimentData = new aliment_entity();
      alimentData.id = 'a1';
      alimentData.title = 'Test Aliment';
      alimentData.description = 'Delicious';
      alimentData.price = 10;
      alimentData.category = 'Fruit';
      alimentData.tag = 'apple';
      alimentData.unit = 'kg';
      alimentData.image = null;
      const expectedAliment = {
        id: 'a1',
        title: 'Test Aliment',
        description: 'Delicious',
        price: 10,
        category: 'Fruit',
        tag: 'apple',
        unit: 'kg',
        image: null,
      };
      jest.spyOn(repo, 'save').mockResolvedValue(alimentData);
      expect(await service.createAliment(alimentData)).toEqual(expectedAliment);
    });
  });

  describe('getAllAliments', () => {
    it('should return all aliments', async () => {
      const aliments: aliment_entity[] = [
        {
          id: 'a1',
          title: 'Test Aliment',
          description: 'Delicious',
          price: 10,
          category: 'Fruit',
          tag: 'apple',
          unit: 'kg',
          image: null,
          items: [],
          recipes: [],
        },
        {
          id: 'a2',
          title: 'Test Aliment 2',
          description: 'Delicious',
          price: 20,
          category: 'Fruit',
          tag: 'banana',
          unit: 'kg',
          image: null,
          items: [],
          recipes: [],
        },
      ];
      jest.spyOn(repo, 'find').mockResolvedValue(aliments);
      expect(await service.getAllAliments()).toEqual(aliments);
    });
  });

  describe('getOneAliment', () => {
    it('should return a aliment', async () => {
      const aliment: aliment_entity = {
        id: 'a1',
        title: 'Test Aliment',
        description: 'Delicious',
        price: 10,
        category: 'Fruit',
        tag: 'apple',
        unit: 'kg',
        image: null,
        items: [],
        recipes: [],
      };
      jest.spyOn(repo, 'findOne').mockResolvedValue(aliment);
      expect(await service.getOneAliment('a1')).toEqual(aliment);
    });
  });

  describe('updateAliment', () => {
    it('should update a aliment', async () => {
      const aliment: aliment_entity = {
        id: 'a1',
        title: 'Test Aliment',
        description: 'Delicious',
        price: 10,
        category: 'Fruit',
        tag: 'apple',
        unit: 'kg',
        image: null,
        items: [],
        recipes: [],
      };
      jest.spyOn(repo, 'save').mockResolvedValue(aliment);
      expect(await service.updateAliment('a1', aliment)).toEqual(aliment);
    });
  });

  describe('deleteAliment', () => {
    it('should delete a aliment', async () => {
      const aliment: aliment_entity = {
        id: 'a1',
        title: 'Test Aliment',
        description: 'Delicious',
        price: 10,
        category: 'Fruit',
        tag: 'apple',
        unit: 'kg',
        image: null,
        items: [],
        recipes: [],
      };
      jest.spyOn(repo, 'findOne').mockResolvedValue(aliment);
      jest.spyOn(repo, 'remove').mockResolvedValue(aliment);
      expect(await service.deleteAliment('a1')).toEqual(aliment);
    });
  });
});
