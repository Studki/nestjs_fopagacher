import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/public.decorator';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

@Controller('/quizz')
@ApiTags('quizz')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  // CRUD operations for the quizz entity
  @Public()
  @Get()
  @ApiOperation({ summary: 'Find all quizz' })
  @ApiResponse({ status: 200, description: 'JSON array of all quizz.' })
  @ApiResponse({ status: 404, description: 'No quizz found.' })
  async findAll() {
    try {
      return this.quizzService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a quizz' })
  @ApiResponse({
    status: 201,
    description: 'The quizz has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createQuizzDto: CreateQuizzDto) {
    try {
      this.quizzService.create(createQuizzDto);
      return 'The quizz has been successfully created.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quizz' })
  @ApiResponse({
    status: 200,
    description: 'The quizz has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Quizz not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateQuizzDto: UpdateQuizzDto,
  ) {
    try {
      const list = await this.quizzService.update(id, updateQuizzDto);
      if (!list) {
        throw new BadRequestException('Quizz not found');
      }
      return 'The quizz has been successfully updated.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quizz' })
  @ApiResponse({
    status: 200,
    description: 'The quizz has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Quizz not found.' })
  async remove(@Param('id') id: string) {
    try {
      const list = await this.quizzService.remove(id);
      if (!list) {
        throw new BadRequestException('Quizz not found');
      }
      return 'The quizz has been successfully deleted.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
