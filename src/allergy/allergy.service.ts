import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { allergy_entity } from './entities/allergy.entity';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';

@Injectable()
export class AllergyService {
  constructor(
    @InjectRepository(allergy_entity)
    private readonly allergyRepository: Repository<allergy_entity>,
  ) {}

  async findOne(id: string) {
    return this.allergyRepository.findOne({ where: { id } });
  }

  async findAll() {
    return this.allergyRepository.find();
  }

  async create(createDateDto: CreateAllergyDto) {
    const newDate = this.allergyRepository.create(createDateDto);
    return this.allergyRepository.save(newDate);
  }

  async update(id: string, UpdateAllergyDto: UpdateAllergyDto) {
    const allergyToUpdate = await this.allergyRepository.findOne({
      where: { id },
    });
    if (!allergyToUpdate) {
      return null;
    }
    const updatedallergy = { ...allergyToUpdate, ...UpdateAllergyDto };
    return this.allergyRepository.save(updatedallergy);
  }

  async remove(id: string) {
    const allergyToRemove = await this.allergyRepository.findOne({
      where: { id },
    });
    if (!allergyToRemove) {
      return null;
    }
    return this.allergyRepository.remove(allergyToRemove);
  }
}
