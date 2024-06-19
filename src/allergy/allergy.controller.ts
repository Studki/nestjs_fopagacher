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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AllergyService } from './allergy.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/shared/public.decorator';

// controller for the allergy entity
@Controller('allergy')
@ApiTags('allergy')
export class AllergyController {
  constructor(private readonly AllergyService: AllergyService) {}

  // CRUD operations for the allergy entity
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Find a allergy by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the allergy.' })
  @ApiResponse({ status: 404, description: 'Allergy not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const allergy = await this.AllergyService.findOne(id);
      if (!allergy) {
        throw new NotFoundException('Allergy not found');
      }
      return allergy;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Find all allergies' })
  @ApiResponse({ status: 200, description: 'JSON array of all dates.' })
  @ApiResponse({ status: 404, description: 'No dates found.' })
  async findAll() {
    try {
      return this.AllergyService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a allergy' })
  @ApiResponse({
    status: 201,
    description: 'The allergy has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createAllergyDto: CreateAllergyDto) {
    try {
      this.AllergyService.create(createAllergyDto);
      return { message: 'The allergy has been successfully created.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a allergy' })
  @ApiResponse({
    status: 200,
    description: 'The allergy has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Allergy not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
  ) {
    try {
      const allergy = await this.AllergyService.update(id, updateAllergyDto);
      if (!allergy) {
        throw new NotFoundException('Allergy not found');
      }
      return 'The allergy has been successfully updated.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a allergy' })
  @ApiResponse({
    status: 200,
    description: 'The allergy has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Allergy not found.' })
  async remove(@Param('id') id: string) {
    try {
      const allergy = await this.AllergyService.remove(id);
      if (!allergy) {
        throw new NotFoundException('Allergy not found');
      }
      return 'The allergy has been successfully deleted.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
