import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagService } from './tag.service';
import { tag_entity } from './entities/tag.entity';
import { createTagDto } from './dto/create-tag.dto';
import { updateTagDto } from './dto/update-tag.dto';

describe('TagService', () => {
  let tagService: TagService;
  let tagRepository: Repository<tag_entity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(tag_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    tagService = moduleRef.get<TagService>(TagService);
    tagRepository = moduleRef.get<Repository<tag_entity>>(
      getRepositoryToken(tag_entity),
    );
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const mockTag = { id: 1, tag: '2023-06-19', users: [] };
      jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(mockTag);

      const result = await tagService.findOne(1);

      expect(result).toEqual(mockTag);
      expect(tagRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      const mockTags = [
        { id: 1, tag: '2023-06-19' },
        { id: 2, tag: '2023-06-20' },
      ].map((tag) => Object.assign(new tag_entity(), tag));
      jest.spyOn(tagRepository, 'find').mockResolvedValueOnce(mockTags);

      const result = await tagService.findAll();

      expect(result).toEqual(mockTags);
      expect(tagRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: createTagDto = {
        tag: '2023-06-19',
        id: 0,
      };
      const createdTag = new tag_entity();
      createdTag.id = 1;
      createdTag.tag = '2023-06-19';
      jest.spyOn(tagRepository, 'create').mockReturnValue(createdTag);
      jest.spyOn(tagRepository, 'save').mockResolvedValueOnce(createdTag);

      const result = await tagService.create(createTagDto);

      expect(result).toEqual(createdTag);
      expect(tagRepository.create).toHaveBeenCalledWith(createTagDto);
      expect(tagRepository.save).toHaveBeenCalledWith(createdTag);
    });
  });

  describe('update', () => {
    it('should update a tag by id', async () => {
      const id = 1;
      const updateTagDto: updateTagDto = { tag: '2023-06-20' };
      const tagToUpdate = { id: 1, tag: '2023-06-19', users: [] };
      const updatedTag = { id: 1, tag: '2023-06-20', users: [] };
      jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(tagToUpdate);
      jest.spyOn(tagRepository, 'save').mockResolvedValueOnce(updatedTag);

      const result = await tagService.update(id, updateTagDto);

      expect(result).toEqual(updatedTag);
      expect(tagRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tagRepository.save).toHaveBeenCalledWith({
        ...tagToUpdate,
        ...updateTagDto,
      });
    });

    it('should return null if tag to update is not found', async () => {
      const id = 1;
      const updateTagDto: updateTagDto = { tag: '2023-06-20' };
      jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await tagService.update(id, updateTagDto);

      expect(result).toBeNull();
      expect(tagRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tagRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a tag by id', async () => {
      const id = 1;
      const dateToRemove = { id: 1, tag: '2023-06-19' };
      const tagToRemove = new tag_entity();
      tagToRemove.id = dateToRemove.id;
      tagToRemove.tag = dateToRemove.tag;
      jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(tagToRemove);
      jest.spyOn(tagRepository, 'remove').mockResolvedValueOnce(tagToRemove);

      const result = await tagService.remove(id);

      expect(result).toEqual(tagToRemove);
      expect(tagRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tagRepository.remove).toHaveBeenCalledWith(tagToRemove);
    });

    it('should return null if tag to remove is not found', async () => {
      const id = 1;
      jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await tagService.remove(id);

      expect(result).toBeNull();
      expect(tagRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tagRepository.remove).not.toHaveBeenCalled();
    });
  });
});
