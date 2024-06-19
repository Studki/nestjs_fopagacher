import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { tag_entity } from './entities/tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;
  let tagRepository: Repository<tag_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        TagService,
        { provide: getRepositoryToken(tag_entity), useClass: Repository },
      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<tag_entity>>(
      getRepositoryToken(tag_entity),
    );
  });

  describe('findOne', () => {
    it('should return a tag', async () => {
      const mockTag: tag_entity = { id: 1, tag: 'Tag 1', users: []};
      jest
        .spyOn(tagService, 'findOne')
        .mockImplementation(() => Promise.resolve(mockTag));

      const result = await tagController.findOne(1);

      expect(result).toEqual(mockTag);
      expect(tagService.findOne).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the tag does not exist', async () => {
      jest
        .spyOn(tagService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(tagController.findOne(1)).rejects.toThrow();
      expect(tagService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const mockTags: tag_entity[] = [
        { id: 1, tag: 'Tag 1', users: [] },
        { id: 2, tag: 'Tag 2', users: [] },
      ];
      jest
        .spyOn(tagService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockTags));

      const result = await tagController.findAll();

      expect(result).toEqual(mockTags);
      expect(tagService.findAll).toHaveBeenCalled();
    });
    it('should return an empty array if there are no tags', async () => {
      const mockTags = [];
      jest
        .spyOn(tagService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockTags));

      const result = await tagController.findAll();

      expect(result).toEqual(mockTags);
      expect(tagService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = { id: 4, tag: 'New Tag'};
      const createdTag: tag_entity = { id: 1, ...createTagDto, users: [] };
      jest
        .spyOn(tagService, 'create')
        .mockImplementation(() => Promise.resolve(createdTag));

      const result = await tagController.create(createTagDto);

      expect(result).toEqual(createdTag);
      expect(tagService.create).toHaveBeenCalledWith(createTagDto);
    });
    it('should throw an error if the tag already exists', async () => {
      const createTagDto: CreateTagDto = { id: 4, tag: 'New Tag'};
      jest
        .spyOn(tagService, 'create')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(tagController.create(createTagDto)).rejects.toThrow();
      expect(tagService.create).toHaveBeenCalledWith(createTagDto);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const updateTagDto: UpdateTagDto = { tag: 'Updated Tag' };
      const updatedTag = { id: 1, ...updateTagDto, users: [] };
      jest
        .spyOn(tagService, 'update')
        .mockImplementation(() => Promise.resolve(updatedTag));

      const result = await tagController.update(1, updateTagDto);

      expect(result).toEqual(updatedTag);
      expect(tagService.update).toHaveBeenCalledWith(1, updateTagDto);
    });
    it('should throw an error if the tag does not exist', async () => {
      const updateTagDto: UpdateTagDto = { tag: 'Updated Tag' };
      jest
        .spyOn(tagService, 'update')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(tagController.update(1, updateTagDto)).rejects.toThrow();
      expect(tagService.update).toHaveBeenCalledWith(1, updateTagDto);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const mockTag: tag_entity = {
        id: 1, tag: '2023-05-18',
        users: []
      };
      jest
        .spyOn(tagService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(mockTag));

      const result = await tagController.remove(1);

      expect(result).toEqual(mockTag);
      expect(tagService.remove).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the tag does not exist', async () => {
      jest
        .spyOn(tagService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      await expect(tagController.remove(1)).rejects.toThrow();
      expect(tagService.remove).toHaveBeenCalledWith(1);
    });
  });
});
