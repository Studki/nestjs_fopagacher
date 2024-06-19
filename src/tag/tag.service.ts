import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { tag_entity } from './entities/tag.entity';
import { createTagDto } from './dto/create-tag.dto';
import { updateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(tag_entity)
    private readonly tagRepository: Repository<tag_entity>,
  ) {}

  async findOne(id: string) {
    return this.tagRepository.findOne({ where: { id } });
  }

  async findAll() {
    return this.tagRepository.find();
  }

  async create(createTagDto: createTagDto) {
    const newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }

  async update(id: string, updateTagDto: updateTagDto) {
    const tagToUpdate = await this.tagRepository.findOne({ where: { id } });
    if (!tagToUpdate) {
      return null;
    }
    const updatedDate = { ...tagToUpdate, ...updateTagDto };
    return this.tagRepository.save(updatedDate);
  }

  async remove(id: string) {
    const tagToRemove = await this.tagRepository.findOne({ where: { id } });
    if (!tagToRemove) {
      return null;
    }
    return this.tagRepository.remove(tagToRemove);
  }
}
