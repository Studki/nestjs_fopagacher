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
import { UstensileService } from './ustensile.service';
import { CreateUstensileDto } from './dto/create-ustensile.dto';
import { UpdateUstensileDto } from './dto/update-ustensile.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/shared/public.decorator';

// controller for the ustensile entity
@Controller('ustensiles')
@ApiTags('ustensiles')
export class UstensileController {
  constructor(private readonly dateService: UstensileService) {}

  // CRUD operations for the ustensile entity
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Find a ustensile by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the ustensile.' })
  @ApiResponse({ status: 404, description: 'ustensile not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const ustensile = await this.dateService.findOne(id);
      if (!ustensile) {
        throw new NotFoundException('ustensile not found');
      }
      return ustensile;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Find all ustensil' })
  @ApiResponse({ status: 200, description: 'JSON array of all .' })
  @ApiResponse({ status: 404, description: 'No dates found.' })
  async findAll() {
    try {
      return this.dateService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a ustensile' })
  @ApiResponse({
    status: 201,
    description: 'The ustensile has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createDateDto: CreateUstensileDto) {
    try {
      const ust = this.dateService.create(createDateDto);
      if (!ust) {
        throw new BadRequestException('Ustensile not created');
      }
      return ust;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ustensile' })
  @ApiResponse({
    status: 200,
    description: 'The ustensile has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'ustensile not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDateDto: UpdateUstensileDto,
  ) {
    try {
      const ustensile = await this.dateService.update(id, updateDateDto);
      if (!ustensile) {
        throw new NotFoundException('ustensile not found');
      }
      return 'The ustensile has been successfully updated.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ustensile' })
  @ApiResponse({
    status: 200,
    description: 'The ustensile has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'ustensile not found.' })
  async remove(@Param('id') id: string) {
    try {
      const ustensile = await this.dateService.remove(id);
      if (!ustensile) {
        throw new NotFoundException('ustensile not found');
      }
      return 'The ustensile has been successfully deleted.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
