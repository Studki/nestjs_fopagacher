import { Test, TestingModule } from '@nestjs/testing';
import { FridgeController } from './fridge.controller';
import { FridgeService } from './fridge.service';
import { CreateFridgeDto } from './dto/create-fridge.dto';
import { UpdateFridgeDto } from './dto/update-fridge.dto';
import { fridge_entity } from './entities/fridge.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

describe('FridgeController', () => {
  let fridgeController: FridgeController;
  let fridgeService: FridgeService;
  let fridgeRepository: Repository<fridge_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FridgeController],
      providers: [
        FridgeService,
        { provide: getRepositoryToken(fridge_entity), useClass: Repository },
      ],
    }).compile();

    fridgeController = module.get<FridgeController>(FridgeController);
    fridgeService = module.get<FridgeService>(FridgeService);
    fridgeRepository = module.get<Repository<fridge_entity>>(
      getRepositoryToken(fridge_entity),
    );
  });

  describe('findOne', () => {
    it('should return a fridge', async () => {
      const mockFridge: fridge_entity = {
        id: 1,
        fridge: 'Fridge 1',
        description: 'my',
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeService, 'findOne')
        .mockImplementation(() => Promise.resolve(mockFridge));

      const result = await fridgeController.findOne(1);

      expect(result).toEqual(mockFridge);
      expect(fridgeService.findOne).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the fridge does not exist', async () => {
      jest
        .spyOn(fridgeService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(fridgeController.findOne(1)).rejects.toThrow();
      expect(fridgeService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of fridges', async () => {
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
      jest
        .spyOn(fridgeService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockFridges));

      const result = await fridgeController.findAll();

      expect(result).toEqual(mockFridges);
      expect(fridgeService.findAll).toHaveBeenCalled();
    });
    it('should return an empty array if there are no fridges', async () => {
      const mockFridges = [];
      jest
        .spyOn(fridgeService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockFridges));

      const result = await fridgeController.findAll();

      expect(result).toEqual(mockFridges);
      expect(fridgeService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new fridge', async () => {
      const createFridgeDto: CreateFridgeDto = {
        fridge: '2023-06-19',
        description: 'miam',
      };
      const request: Request<
        ParamsDictionary,
        any,
        any,
        ParsedQs,
        Record<string, any>
      > = { user: null } as unknown as Request<
        ParamsDictionary,
        any,
        any,
        ParsedQs,
        Record<string, any>
      >;
      const createdFridge = {
        id: 1,
        ...createFridgeDto,
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeService, 'create')
        .mockImplementation(
          (
            dto1: CreateFridgeDto,
            dto2: Request<
              ParamsDictionary,
              any,
              any,
              ParsedQs,
              Record<string, any>
            >,
          ) => Promise.resolve(createdFridge),
        );

      const result = await fridgeController.create(createFridgeDto, request);

      expect(result).toEqual(createdFridge);
      expect(fridgeService.create).toHaveBeenCalledWith(
        createFridgeDto,
        undefined,
      );
    });
    it('should throw an error if the fridge already exists', async () => {
      const createFridgeDto: CreateFridgeDto = {
        fridge: 'New Fridge',
        description: 'miam',
      };
      const request: Request<
        ParamsDictionary,
        any,
        any,
        ParsedQs,
        Record<string, any>
      > = { user: null } as unknown as Request<
        ParamsDictionary,
        any,
        any,
        ParsedQs,
        Record<string, any>
      >;
      jest
        .spyOn(fridgeService, 'create')
        .mockImplementation(
          (
            dto1: CreateFridgeDto,
            dto2: Request<
              ParamsDictionary,
              any,
              any,
              ParsedQs,
              Record<string, any>
            >,
          ) => Promise.resolve(undefined),
        );

      await expect(
        fridgeController.create(createFridgeDto, request),
      ).rejects.toThrow();
      expect(fridgeService.create).toHaveBeenCalledWith(
        createFridgeDto,
        undefined,
      );
    });
  });

  describe('update', () => {
    it('should update a fridge', async () => {
      const updateFridgeDto: UpdateFridgeDto = {
        fridge: '2023-06-20',
        description: 'truc',
      };
      const updatedFridge = {
        id: 1,
        fridge: '2023-06-20',
        description: 'truc',
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeService, 'update')
        .mockImplementation(() => Promise.resolve(updatedFridge));

      const result = await fridgeController.update(1, updateFridgeDto);

      expect(result).toEqual(updatedFridge);
      expect(fridgeService.update).toHaveBeenCalledWith(1, updateFridgeDto);
    });
    it('should throw an error if the fridge does not exist', async () => {
      const updateFridgeDto: UpdateFridgeDto = {
        fridge: '2023-06-20',
        description: 'truc',
      };
      const updatedFridge = {
        id: 1,
        fridge: '2023-06-20',
        description: 'truc',
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeService, 'update')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(
        fridgeController.update(1, updateFridgeDto),
      ).rejects.toThrow();
      expect(fridgeService.update).toHaveBeenCalledWith(1, updateFridgeDto);
    });
  });

  describe('remove', () => {
    it('should remove a fridge', async () => {
      const mockFridge: fridge_entity = {
        id: 1,
        fridge: '2023-05-18',
        description: 'miam',
        aliments: [],
        user: null,
      };
      jest
        .spyOn(fridgeService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(mockFridge));

      const result = await fridgeController.remove(1);

      expect(result).toEqual(mockFridge);
      expect(fridgeService.remove).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the fridge does not exist', async () => {
      jest
        .spyOn(fridgeService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      await expect(fridgeController.remove(1)).rejects.toThrow();
      expect(fridgeService.remove).toHaveBeenCalledWith(1);
    });
  });
});
