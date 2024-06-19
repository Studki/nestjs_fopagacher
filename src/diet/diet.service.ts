import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { diet_entity } from './entities/diet.entity';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Injectable()
export class DietService {
  constructor(
    @InjectRepository(diet_entity)
    private readonly dietRepository: Repository<diet_entity>,
  ) {}

  async findOne(id: string) {
    return this.dietRepository.findOne({ where: { id } });
  }

  async findAll() {
    return this.dietRepository.find();
  }

  async create(createDateDto: CreateDietDto) {
    const newDate = this.dietRepository.create(createDateDto);
    return this.dietRepository.save(newDate);
  }

  async update(id: string, updateDietDto: UpdateDietDto) {
    const dietToUpdate = await this.dietRepository.findOne({ where: { id } });
    if (!dietToUpdate) {
      return null;
    }
    const updatedDiet = { ...dietToUpdate, ...updateDietDto };
    return this.dietRepository.save(updatedDiet);
  }

  async remove(id: string) {
    const dietToRemove = await this.dietRepository.findOne({ where: { id } });
    if (!dietToRemove) {
      return null;
    }
    return this.dietRepository.remove(dietToRemove);
  }
}
