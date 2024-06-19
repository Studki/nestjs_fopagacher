import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListService } from './list.service';
import { list_entity } from './entities/list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

describe('ListService', () => {
  let dateService: ListService;
  let dateRepository: Repository<list_entity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getRepositoryToken(list_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    dateService = moduleRef.get<ListService>(ListService);
    dateRepository = moduleRef.get<Repository<list_entity>>(
      getRepositoryToken(list_entity),
    );
  });

  describe('findOne', () => {
    it('should return a list by id', async () => {
      const mockList = { id: 1, list: '2023-06-19' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(mockList);

      const result = await dateService.findOne(1);

      expect(result).toEqual(mockList);
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all lists', async () => {
      const mockLists = [
        { id: 1, list: '2023-06-19' },
        { id: 2, list: '2023-06-20' },
      ];
      jest.spyOn(dateRepository, 'find').mockResolvedValueOnce(mockLists);

      const result = await dateService.findAll();

      expect(result).toEqual(mockLists);
      expect(dateRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new list', async () => {
      const createDateDto: CreateListDto = {
        list: '2023-06-19',
        id: 0,
      };
      const createdList = { id: 1, list: '2023-06-19' };
      jest.spyOn(dateRepository, 'create').mockReturnValue(createdList);
      jest.spyOn(dateRepository, 'save').mockResolvedValueOnce(createdList);

      const result = await dateService.create(createDateDto);

      expect(result).toEqual(createdList);
      expect(dateRepository.create).toHaveBeenCalledWith(createDateDto);
      expect(dateRepository.save).toHaveBeenCalledWith(createdList);
    });
  });

  describe('update', () => {
    it('should update a list by id', async () => {
      const id = 1;
      const updateDateDto: UpdateListDto = { list: '2023-06-20' };
      const listToUpdate = { id: 1, list: '2023-06-19' };
      const updatedDate = { id: 1, list: '2023-06-20' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(listToUpdate);
      jest.spyOn(dateRepository, 'save').mockResolvedValueOnce(updatedDate);

      const result = await dateService.update(id, updateDateDto);

      expect(result).toEqual(updatedDate);
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.save).toHaveBeenCalledWith(updatedDate);
    });

    it('should return null if list to update is not found', async () => {
      const id = 1;
      const updateDateDto: UpdateListDto = { list: '2023-06-20' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await dateService.update(id, updateDateDto);

      expect(result).toBeNull();
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a list by id', async () => {
      const id = 1;
      const dateToRemove = { id: 1, list: '2023-06-19' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(dateToRemove);
      jest.spyOn(dateRepository, 'remove').mockResolvedValueOnce(dateToRemove);

      const result = await dateService.remove(id);

      expect(result).toEqual(dateToRemove);
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.remove).toHaveBeenCalledWith(dateToRemove);
    });

    it('should return null if list to remove is not found', async () => {
      const id = 1;
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await dateService.remove(id);

      expect(result).toBeNull();
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.remove).not.toHaveBeenCalled();
    });
  });
});
