import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { quizz_entity } from './entities/quizz.entity';
import { Repository } from 'typeorm';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(quizz_entity)
    private readonly quizzRepository: Repository<quizz_entity>,
  ) {}

  async findAll() {
    return this.quizzRepository.find();
  }

  async create(createQuizzDto: CreateQuizzDto) {
    const newQuizz = this.quizzRepository.create(createQuizzDto);
    return this.quizzRepository.save(newQuizz);
  }

  async update(id: string, updateQuizzDto: UpdateQuizzDto) {
    const quizzToUpdate = await this.quizzRepository.findOne({ where: { id } });
    if (!quizzToUpdate) {
      return null;
    }
    const updatedQuizz = { ...quizzToUpdate, ...updateQuizzDto };
    return this.quizzRepository.save(updatedQuizz);
  }

  async remove(id: string) {
    const quizzToRemove = await this.quizzRepository.findOne({ where: { id } });
    if (!quizzToRemove) {
      return null;
    }
    return this.quizzRepository.remove(quizzToRemove);
  }
}
