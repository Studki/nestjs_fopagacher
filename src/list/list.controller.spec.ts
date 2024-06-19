import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { list_entity } from './entities/list.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ListController', () => {
  let listController: ListController;
  let listService: ListService;
  let listRepository: Repository<list_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        ListService,
        { provide: getRepositoryToken(list_entity), useClass: Repository },
      ],
    }).compile();

    listController = module.get<ListController>(ListController);
    listService = module.get<ListService>(ListService);
    listRepository = module.get<Repository<list_entity>>(
      getRepositoryToken(list_entity),
    );
  });

  describe('findOne', () => {
    it('should return a list', async () => {
      const mockList: list_entity = { id: 1, list: 'List 1', description: 'Description 1' };
      jest
        .spyOn(listService, 'findOne')
        .mockImplementation(() => Promise.resolve(mockList));

      const result = await listController.findOne(1);

      expect(result).toEqual(mockList);
      expect(listService.findOne).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the list does not exist', async () => {
      jest
        .spyOn(listService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(listController.findOne(1)).rejects.toThrow();
      expect(listService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of lists', async () => {
      const mockLists = [
        { id: 1, list: 'List 1', description: 'Description 1' },
        { id: 2, list: 'List 2', description: 'Description 2' },
      ];
      jest
        .spyOn(listService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockLists));

      const result = await listController.findAll();

      expect(result).toEqual(mockLists);
      expect(listService.findAll).toHaveBeenCalled();
    });
    it('should return an empty array if there are no lists', async () => {
      const mockLists = [];
      jest
        .spyOn(listService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockLists));

      const result = await listController.findAll();

      expect(result).toEqual(mockLists);
      expect(listService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new list', async () => {
      const createListDto: CreateListDto = { id: 4, list: 'New List', description: 'New Description' };
      const createdList = { id: 1, ...createListDto };
      jest
        .spyOn(listService, 'create')
        .mockImplementation(() => Promise.resolve(createdList));

      const result = await listController.create(createListDto);

      expect(result).toEqual(createdList);
      expect(listService.create).toHaveBeenCalledWith(createListDto);
    });
    it('should throw an error if the list already exists', async () => {
      const createListDto: CreateListDto = { id: 4, list: 'New List', description: 'New Description' };
      jest
        .spyOn(listService, 'create')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(listController.create(createListDto)).rejects.toThrow();
      expect(listService.create).toHaveBeenCalledWith(createListDto);
    });
  });

  describe('update', () => {
    it('should update a list', async () => {
      const updateListDto: UpdateListDto = { list: 'Updated List', description: 'Updated Description' };
      const updatedList = { id: 1, ...updateListDto };
      jest
        .spyOn(listService, 'update')
        .mockImplementation(() => Promise.resolve(updatedList));

      const result = await listController.update(1, updateListDto);

      expect(result).toEqual(updatedList);
      expect(listService.update).toHaveBeenCalledWith(1, updateListDto);
    });
    it('should throw an error if the list does not exist', async () => {
      const updateListDto: UpdateListDto = { list: 'Updated List', description: 'Updated Description' };
      jest
        .spyOn(listService, 'update')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(listController.update(1, updateListDto)).rejects.toThrow();
      expect(listService.update).toHaveBeenCalledWith(1, updateListDto);
    });
  });

  describe('remove', () => {
    it('should remove a list', async () => {
      const mockList: list_entity = { id: 1, list: '2023-05-18', description: 'Description 1' };
      jest
        .spyOn(listService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(mockList));

      const result = await listController.remove(1);

      expect(result).toEqual(mockList);
      expect(listService.remove).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the list does not exist', async () => {
      jest
        .spyOn(listService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      await expect(listController.remove(1)).rejects.toThrow();
      expect(listService.remove).toHaveBeenCalledWith(1);
    });
  });
});
