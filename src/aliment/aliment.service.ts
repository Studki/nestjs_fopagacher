import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { aliment_entity } from './entities/aliment.entity';
import { createAliment, PatchAlimentDto } from './dto/index';

@Injectable()
export class AlimentsService {
  constructor(
    @InjectRepository(aliment_entity)
    private readonly alimentRepository: Repository<aliment_entity>,
  ) {}

  async getAllAliments(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: aliment_entity[]; count: number }> {
    const [data, count] = await this.alimentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, count };
  }

  async getNumberOfProducts(): Promise<number> {
    return this.alimentRepository.count();
  }

  async getOneAliment(id: string): Promise<aliment_entity> {
    return await this.alimentRepository.findOne({ where: { id } });
  }

  async getAliment(tag: string): Promise<aliment_entity> {
    return await this.alimentRepository.findOne({ where: { tag } });
  }

  async getTheAliment(title: string): Promise<aliment_entity> {
    return await this.alimentRepository.findOne({ where: { title } });
  }

  async createAliment(aliment: createAliment): Promise<aliment_entity> {
    // const existingAliment = await this.alimentRepository.findOne({
    //   where: { title: aliment.title },
    // });
    // if (existingAliment) {
    //   throw new BadRequestException('Aliment already exists');
    // }
    const newAliment = new aliment_entity();
    newAliment.title = aliment.title;
    newAliment.description = aliment.description;
    newAliment.price = aliment.price;
    newAliment.image = aliment.image;
    newAliment.category = aliment.category;
    newAliment.tag = aliment.tag;
    newAliment.unit = aliment.unit;
    return await this.alimentRepository.save(newAliment);
  }

  async updateAliment(
    tag: string,
    aliment: PatchAlimentDto,
  ): Promise<aliment_entity> {
    const alimentToUpdate = await this.alimentRepository.findOne({
      where: { tag },
    });
    alimentToUpdate.title = aliment.title;
    alimentToUpdate.description = aliment.description;
    alimentToUpdate.price = aliment.price;
    alimentToUpdate.image = aliment.image;
    alimentToUpdate.category = aliment.category;
    alimentToUpdate.tag = aliment.tag;
    return await this.alimentRepository.save(alimentToUpdate);
  }

  async updateOneAliment(
    id: string,
    aliment: PatchAlimentDto,
  ): Promise<aliment_entity> {
    const alimentToUpdate = await this.alimentRepository.findOne({
      where: { id },
    });
    alimentToUpdate.title = aliment.title;
    alimentToUpdate.description = aliment.description;
    alimentToUpdate.price = aliment.price;
    alimentToUpdate.image = aliment.image;
    alimentToUpdate.category = aliment.category;
    alimentToUpdate.tag = aliment.tag;
    return await this.alimentRepository.save(alimentToUpdate);
  }

  async deleteAliment(tag: string): Promise<aliment_entity> {
    const alimentToDelete = await this.alimentRepository.findOne({
      where: { tag },
    });
    return await this.alimentRepository.remove(alimentToDelete);
  }

  async deleteOneAliment(id: string): Promise<aliment_entity> {
    const alimentToDelete = await this.alimentRepository.findOne({
      where: { id },
    });
    return await this.alimentRepository.remove(alimentToDelete);
  }

  async postOneAliment(
    id: string,
    aliment: PatchAlimentDto,
  ): Promise<aliment_entity> {
    const alimentToUpdate = await this?.alimentRepository.findOne({
      where: { id },
    });
    alimentToUpdate.title = aliment.title;
    alimentToUpdate.description = aliment.description;
    alimentToUpdate.price = aliment.price;
    alimentToUpdate.image = aliment.image;
    alimentToUpdate.category = aliment.category;
    alimentToUpdate.tag = aliment.tag;
    return await this.alimentRepository.save(alimentToUpdate);
  }
}
