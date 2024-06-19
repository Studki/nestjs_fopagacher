import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ustensile_entity } from './entities/ustensile.entity';
import { CreateUstensileDto } from './dto/create-ustensile.dto';
import { UpdateUstensileDto } from './dto/update-ustensile.dto';

@Injectable()
export class UstensileService {
  constructor(
    @InjectRepository(ustensile_entity)
    private readonly ustensileRepository: Repository<ustensile_entity>,
  ) {}

  async findOne(id: string) {
    return this.ustensileRepository.findOne({ where: { id } });
  }

  async findAll() {
    return this.ustensileRepository.find();
  }

  async create(createUstensileDto: CreateUstensileDto) {
    const isUstensileExist = await this.ustensileRepository.findOne({
      where: { title: createUstensileDto.title },
    });
    if (isUstensileExist) {
      console.log('Ustensile already exist');
      throw new BadRequestException('Ustensile already exist');
    }
    const newUstensile = this.ustensileRepository.create(createUstensileDto);
    return this.ustensileRepository.save(newUstensile);
  }

  async update(id: string, updateUstensileDto: UpdateUstensileDto) {
    const ustensileToUpdate = await this.ustensileRepository.findOne({
      where: { id },
    });
    if (!ustensileToUpdate) {
      throw new BadRequestException('Ustensile not found');
    }
    const updateUstensile = { ...ustensileToUpdate, ...updateUstensileDto };
    return this.ustensileRepository.save(updateUstensile);
  }

  async remove(id: string) {
    const ustensileToRemove = await this.ustensileRepository.findOne({
      where: { id },
    });
    if (!ustensileToRemove) {
      return null;
    }
    return this.ustensileRepository.remove(ustensileToRemove);
  }
}
