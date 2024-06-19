import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateService } from './event.service';
import { event_entity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDateDto } from './dto/update-event.dto';

describe('DateService', () => {
  let dateService: DateService;
  let dateRepository: Repository<event_entity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DateService,
        {
          provide: getRepositoryToken(event_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    dateService = moduleRef.get<DateService>(DateService);
    dateRepository = moduleRef.get<Repository<event_entity>>(
      getRepositoryToken(event_entity),
    );
  });

  describe('findOne', () => {
    it('should return a date by id', async () => {
      const mockDate = { id: 1, date: '2023-06-19' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(mockDate);

      const result = await dateService.findOne(1);

      expect(result).toEqual(mockDate);
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all dates', async () => {
      const mockDates = [
        { id: 1, date: '2023-06-19' },
        { id: 2, date: '2023-06-20' },
      ];
      jest.spyOn(dateRepository, 'find').mockResolvedValueOnce(mockDates);

      const result = await dateService.findAll();

      expect(result).toEqual(mockDates);
      expect(dateRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new date', async () => {
      const CreateEventDto: CreateEventDto = {
        date: '2023-06-19',
        id: 0,
      };
      const createdDate = { id: 1, date: '2023-06-19' };
      jest.spyOn(dateRepository, 'create').mockReturnValue(createdDate);
      jest.spyOn(dateRepository, 'save').mockResolvedValueOnce(createdDate);

      const result = await dateService.create(CreateEventDto);

      expect(result).toEqual(createdDate);
      expect(dateRepository.create).toHaveBeenCalledWith(CreateEventDto);
      expect(dateRepository.save).toHaveBeenCalledWith(createdDate);
    });
  });

  describe('update', () => {
    it('should update a date by id', async () => {
      const id = 1;
      const updateDateDto: UpdateDateDto = { date: '2023-06-20' };
      const dateToUpdate = { id: 1, date: '2023-06-19' };
      const updatedDate = { id: 1, date: '2023-06-20' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(dateToUpdate);
      jest.spyOn(dateRepository, 'save').mockResolvedValueOnce(updatedDate);

      const result = await dateService.update(id, updateDateDto);

      expect(result).toEqual(updatedDate);
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.save).toHaveBeenCalledWith(updatedDate);
    });

    it('should return null if date to update is not found', async () => {
      const id = 1;
      const updateDateDto: UpdateDateDto = { date: '2023-06-20' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await dateService.update(id, updateDateDto);

      expect(result).toBeNull();
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a date by id', async () => {
      const id = 1;
      const dateToRemove = { id: 1, date: '2023-06-19' };
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(dateToRemove);
      jest.spyOn(dateRepository, 'remove').mockResolvedValueOnce(dateToRemove);

      const result = await dateService.remove(id);

      expect(result).toEqual(dateToRemove);
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.remove).toHaveBeenCalledWith(dateToRemove);
    });

    it('should return null if date to remove is not found', async () => {
      const id = 1;
      jest.spyOn(dateRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await dateService.remove(id);

      expect(result).toBeNull();
      expect(dateRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dateRepository.remove).not.toHaveBeenCalled();
    });
  });
});
