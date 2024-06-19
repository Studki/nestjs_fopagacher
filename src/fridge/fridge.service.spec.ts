import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FridgeService } from './fridge.service';
import { fridge_entity } from './entities/fridge.entity';
import { AlimentsService } from '../aliment/aliment.service';
import { AlimentDto, UpdateFridgeDto, CreateFridgeDto } from './dto/index';

describe('FridgeService', () => {
  let fridgeService: FridgeService;
  let AlimentsService: AlimentsService;
  let fridgeRepository: Repository<fridge_entity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FridgeService,
        {
          provide: getRepositoryToken(fridge_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    fridgeService = moduleRef.get<FridgeService>(FridgeService);
    fridgeRepository = moduleRef.get<Repository<fridge_entity>>(
      getRepositoryToken(fridge_entity),
    );
  });

  describe('findOne', () => {
    it('should return a fridge by id', async () => {
      const mockFridge: fridge_entity = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };
      jest.spyOn(fridgeRepository, 'findOne').mockResolvedValueOnce(mockFridge);

      const result = await fridgeService.findOne(1);

      expect(result).toEqual(mockFridge);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findAll', () => {
    it('should return all fridges', async () => {
      const mockFridges: fridge_entity[] = [
        {
          id: 1,
          fridge: 'Fridge 1',
          description: 'miam',
          aliments: [],
          user: null,
        },
        {
          id: 2,
          fridge: 'Fridge 2',
          description: 'miam',
          aliments: [],
          user: null,
        },
      ];
      jest.spyOn(fridgeRepository, 'find').mockResolvedValueOnce(mockFridges);

      const result = await fridgeService.findAll();

      expect(result).toEqual(mockFridges);
      expect(fridgeRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new fridge', async () => {
      const createFrigoDto: CreateFridgeDto = {
        fridge: '2023-06-19',
        description: 'miam',
      };
      const createdFridge = {
        id: 1,
        ...createFrigoDto,
        aliments: [],
        user: null,
      };
      jest.spyOn(fridgeRepository, 'create').mockReturnValue(createdFridge);
      jest.spyOn(fridgeRepository, 'save').mockResolvedValueOnce(createdFridge);

      const result = await fridgeService.create(createFrigoDto, null);

      expect(result).toEqual(createdFridge);
      expect(fridgeRepository.create).toHaveBeenCalledWith(
        createFrigoDto,
        null,
      );
      expect(fridgeRepository.save).toHaveBeenCalledWith(createdFridge);
    });
  });

  describe('update', () => {
    it('should update a fridge by id', async () => {
      const id = 1;
      const updateDateDto: UpdateFridgeDto = {
        fridge: '2023-06-20',
        description: 'truc',
      };
      const fridgeToUpdate = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };
      const updatedDate = {
        id: 1,
        fridge: '2023-06-20',
        description: 'truc',
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(fridgeToUpdate);
      jest.spyOn(fridgeRepository, 'save').mockResolvedValueOnce(updatedDate);

      const result = await fridgeService.update(id, updateDateDto);

      expect(result).toEqual(updatedDate);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.save).toHaveBeenCalledWith(updatedDate);
    });

    it('should return null if fridge to update is not found', async () => {
      const id = 1;
      const updateDateDto: UpdateFridgeDto = {
        fridge: '2023-06-20',
        description: 'truc',
      };
      jest.spyOn(fridgeRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await fridgeService.update(id, updateDateDto);

      expect(result).toBeNull();
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a fridge by id', async () => {
      const id = 1;
      const dateToRemove = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(dateToRemove);
      jest
        .spyOn(fridgeRepository, 'remove')
        .mockResolvedValueOnce(dateToRemove);

      const result = await fridgeService.remove(id);

      expect(result).toEqual(dateToRemove);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.remove).toHaveBeenCalledWith(dateToRemove);
    });

    it('should return null if fridge to remove is not found', async () => {
      const id = 1;
      jest.spyOn(fridgeRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await fridgeService.remove(id);

      expect(result).toBeNull();
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('addAliment', () => {
    it('should add an aliment to a fridge', async () => {
      const id = 1;
      const aliment: AlimentDto = { aliment: 'apple' };
      const fridgeToUpdate = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };
      const updateAliment = await AlimentsService.getTheAliment('apple');
      const updatedFridge: fridge_entity = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };
      updatedFridge.aliments.push(updateAliment);
      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(fridgeToUpdate);
      jest.spyOn(fridgeRepository, 'save').mockResolvedValueOnce(updatedFridge);

      const result = await fridgeService.addAliment(id, aliment);

      expect(result).toEqual(updatedFridge);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.save).toHaveBeenCalledWith(updatedFridge);
    });
  });

  describe('removeAliment', () => {
    it('should remove an aliment from the fridge', async () => {
      // Arrange
      const id = 1;
      const aliment: AlimentDto = { aliment: 'apple' };
      const fridgeToUpdate = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [
          {
            id: 1,
            name: 'apple',
            description: 'fruit',
            price: 2,
            image: null,
            category: 'fruit',
            tag: 'miam',
          },
        ],
        user: null,
      };
      const updatedFridge: fridge_entity = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };

      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(fridgeToUpdate);
      jest.spyOn(fridgeRepository, 'save').mockResolvedValueOnce(updatedFridge);

      // Act
      const result = await fridgeService.removeAliment(id, aliment);

      // Assert
      expect(result).toEqual(updatedFridge);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.save).toHaveBeenCalledWith(updatedFridge);
    });
  });

  describe('getAllAliment', () => {
    it('should return all aliments from the fridge', async () => {
      // Arrange
      const id = 1;
      const fridgeToUpdate = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [
          {
            id: 1,
            name: 'apple',
            description: 'fruit',
            price: 2,
            image: null,
            category: 'fruit',
            tag: 'miam',
          },
        ],
        user: null,
      };
      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(fridgeToUpdate);

      // Act
      const result = await fridgeService.getAllAliments(id);

      // Assert
      expect(result).toEqual(fridgeToUpdate.aliments);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findOneAliment', () => {
    it('should return one aliment from the fridge', async () => {
      // Arrange
      const id = 1;
      const tag = 'miam';
      const fridgeToUpdate = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [
          {
            id: 1,
            name: 'apple',
            description: 'fruit',
            price: 2,
            image: null,
            category: 'fruit',
            tag: 'miam',
          },
        ],
        user: null,
      };
      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(fridgeToUpdate);

      // Act
      const result = await fridgeService.findOneAliment(id, tag);

      // Assert
      expect(result).toEqual([fridgeToUpdate.aliments[0]]);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('updadteAliment', () => {
    it('should update an aliment from the fridge', async () => {
      // Arrange
      const id = 1;
      const aliment: AlimentDto = { aliment: 'apple' };
      const tag = 'miam';
      const fridgeToUpdate = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [
          {
            id: 1,
            name: 'apple',
            description: 'fruit',
            price: 2,
            image: null,
            category: 'fruit',
            tag: 'miam',
          },
        ],
        user: null,
      };
      const updatedFridge: fridge_entity = {
        id: 1,
        fridge: '2023-06-19',
        description: 'miam',
        aliments: [],
        user: null,
      };

      jest
        .spyOn(fridgeRepository, 'findOne')
        .mockResolvedValueOnce(fridgeToUpdate);
      jest.spyOn(fridgeRepository, 'save').mockResolvedValueOnce(updatedFridge);

      // Act
      const result = await fridgeService.updateAliment(id, tag, aliment);

      // Assert
      expect(result).toEqual(updatedFridge);
      expect(fridgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(fridgeRepository.save).toHaveBeenCalledWith(updatedFridge);
    });
  });
});
