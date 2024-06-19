import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DietService } from './diet.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/shared/public.decorator';

// controller for the diet entity
@Controller('diet')
@ApiTags('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  // CRUD operations for the diet entity
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Find a diet by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the diet.' })
  @ApiResponse({ status: 404, description: 'Diet not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const diet = await this.dietService.findOne(id);
      if (!diet) {
        throw new NotFoundException('Diet not found');
      }
      return diet;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Find all dates' })
  @ApiResponse({ status: 200, description: 'JSON array of all dates.' })
  @ApiResponse({ status: 404, description: 'No dates found.' })
  async findAll() {
    try {
      return this.dietService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a diet' })
  @ApiResponse({
    status: 201,
    description: 'The diet has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createDietDto: CreateDietDto) {
    try {
      this.dietService.create(createDietDto);
      return 'The diet has been successfully created.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a diet' })
  @ApiResponse({
    status: 200,
    description: 'The diet has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Diet not found.' })
  async update(@Param('id') id: string, @Body() updateDateDto: UpdateDietDto) {
    try {
      const diet = await this.dietService.update(id, updateDateDto);
      if (!diet) {
        throw new NotFoundException('Diet not found');
      }
      return 'The diet has been successfully updated.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a diet' })
  @ApiResponse({
    status: 200,
    description: 'The diet has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Diet not found.' })
  async remove(@Param('id') id: string) {
    try {
      const diet = await this.dietService.remove(id);
      if (!diet) {
        throw new NotFoundException('Diet not found');
      }
      return 'The diet has been successfully deleted.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
