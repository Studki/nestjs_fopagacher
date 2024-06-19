import { Test, TestingModule } from '@nestjs/testing';
import { DateController } from './event.controller';
import { DateService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDateDto } from './dto/update-event.dto';
import { event_entity } from './entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

describe('DateController', () => {
  let dateController: DateController;
  let dateService: DateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateController],
      providers: [
        DateService,
        { provide: getRepositoryToken(event_entity), useClass: Repository },
      ],
    }).compile();

    dateController = module.get<DateController>(DateController);
    dateService = module.get<DateService>(DateService);
  });

  describe('findOne', () => {
    it('should return a date', async () => {
      const mockDate: event_entity = { id: '1', date: new Date(), recipeID: null, image: 'image', title: 'title', alimentID: '1', itemQuantity: [], quantity: 1, calendar: null};
      jest
        .spyOn(dateService, 'findOne')
        .mockImplementation(() => Promise.resolve(mockDate));

      const result = await dateController.findOne('1', {} as any);

      expect(result).toEqual(mockDate);
      expect(dateService.findOne).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the date does not exist', async () => {
      jest
        .spyOn(dateService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(dateController.findOne('1', {} as any)).rejects.toThrow();
      expect(dateService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new date', async () => {
      const createDateDto: CreateEventDto = { date: new Date().toUTCString(), image: 'image', title: 'title', alimentID: '1', quantity: 1};
      const createdDate = { id: '1',recipeID: null, calendar: null,...createDateDto } as event_entity; // Cast createdDate to event_entity
      jest
        .spyOn(dateService, 'create')
        .mockImplementation(() => Promise.resolve(createdDate));

      const result = await dateController.create(createDateDto);

      expect(result).toEqual(createdDate);
      expect(dateService.create).toHaveBeenCalledWith(createDateDto);
    });
    it('should throw an error if the date already exists', async () => {
      const createDateDto: CreateEventDto = { id: 4, date: 'New Date' };
      jest
        .spyOn(dateService, 'create')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(dateController.create(createDateDto)).rejects.toThrow();
      expect(dateService.create).toHaveBeenCalledWith(createDateDto);
    });
  });

  describe('update', () => {
    it('should update a date', async () => {
      const updateDateDto: UpdateDateDto = { date: 'Updated Date' };
      const updatedDate = { id: 1, ...updateDateDto };
      jest
        .spyOn(dateService, 'update')
        .mockImplementation(() => Promise.resolve(updatedDate));

      const result = await dateController.update(1, updateDateDto);

      expect(result).toEqual(updatedDate);
      expect(dateService.update).toHaveBeenCalledWith(1, updateDateDto);
    });
    it('should throw an error if the date does not exist', async () => {
      const updateDateDto: UpdateDateDto = { date: 'Updated Date' };
      jest
        .spyOn(dateService, 'update')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(dateController.update(1, updateDateDto)).rejects.toThrow();
      expect(dateService.update).toHaveBeenCalledWith(1, updateDateDto);
    });
  });

  describe('remove', () => {
    it('should remove a date', async () => {
      const mockDate: event_entity = { id: '1', date: new Date(), recipeID: null, image: 'image', title: 'title', alimentID: '1', itemQuantity: [], quantity: 1, calendar: null},;
      jest
        .spyOn(dateService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(mockDate));

      const result = await dateController.remove(1);

      expect(result).toEqual(mockDate);
      expect(dateService.remove).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the date does not exist', async () => {
      jest
        .spyOn(dateService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      await expect(dateController.remove(1)).rejects.toThrow();
      expect(dateService.remove).toHaveBeenCalledWith(1);
    });
  });
});
