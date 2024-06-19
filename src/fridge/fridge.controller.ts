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
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FridgeService } from './fridge.service';
import { AlimentDto, UpdateFridgeDto, CreateFridgeDto } from './dto/index';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { fridge_entity } from './entities/fridge.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('fridge')
@ApiTags('fridge')
export class FridgeController {
  constructor(private readonly fridgeService: FridgeService) {}

  @Get('images')
  @ApiOperation({ summary: 'get images for a fridge' })
  @ApiResponse({
    status: 200,
    description: 'The fridge has been successfully get.',
  })
  async getImages(): Promise<string[]> {
    const images: string[] = await this.fridgeService.getImagesService();
    if (!images) {
      throw new BadRequestException('Error while getting the images');
    }
    return images;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a fridge by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the fridge.' })
  @ApiResponse({ status: 404, description: 'Fridge not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const fridge = await this.fridgeService.findOne(id);
      if (!fridge) {
        throw new NotFoundException('Fridge not found');
      }
      return fridge;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all fridges' })
  @ApiResponse({ status: 200, description: 'JSON array of all fridges.' })
  @ApiResponse({ status: 404, description: 'No fridges found.' })
  async findAll(@Req() request: Request) {
    try {
      return this.fridgeService.findAll(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a fridge' })
  @ApiResponse({
    status: 201,
    description: 'The fridge has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createFridgeDto: CreateFridgeDto,
    @Req() request: Request,
  ): Promise<fridge_entity> {
    try {
      return this.fridgeService.create(createFridgeDto, request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fridge' })
  @ApiResponse({
    status: 200,
    description: 'The fridge has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Fridge not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateFridgeDto: UpdateFridgeDto,
  ) {
    try {
      const fridge = await this.fridgeService.update(id, updateFridgeDto);
      if (!fridge) {
        throw new NotFoundException('Fridge not found');
      }
      return { message: 'The fridge has been successfully updated.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fridge' })
  @ApiResponse({
    status: 200,
    description: 'The fridge has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Fridge not found.' })
  async remove(@Param('id') id: string, @Req() request: Request) {
    try {
      return await this.fridgeService.remove(id, request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/aliment')
  @ApiOperation({ summary: 'Add an aliment to a fridge' })
  @ApiResponse({
    status: 200,
    description: 'The aliment has been successfully added to the fridge.',
  })
  @ApiResponse({ status: 404, description: 'Fridge or aliment not found.' })
  async addAliment(@Param('id') id: string, @Body() AlimentDto: AlimentDto) {
    try {
      const fridge = await this.fridgeService.addAliment(id, AlimentDto);
      if (!fridge) {
        throw new NotFoundException('Fridge or aliment not found');
      }
      return 'The aliment has been successfully added to the fridge.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id/aliment')
  @ApiOperation({ summary: 'Remove an aliment from a fridge' })
  @ApiResponse({
    status: 200,
    description: 'The aliment has been successfully removed from the fridge.',
  })
  @ApiResponse({ status: 404, description: 'Fridge or aliment not found.' })
  async removeAliment(@Param('id') id: string, @Body() AlimentDto: AlimentDto) {
    try {
      const fridge = await this.fridgeService.removeAliment(id, AlimentDto);
      if (!fridge) {
        throw new NotFoundException('Fridge or aliment not found');
      }
      return 'The aliment has been successfully removed from the fridge.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id/empty')
  @ApiOperation({ summary: 'Empty a fridge' })
  @ApiResponse({
    status: 200,
    description: 'The fridge has been successfully emptied.',
  })
  @ApiResponse({ status: 404, description: 'Fridge not found.' })
  async empty(@Param('id') id: string) {
    try {
      const fridge = await this.fridgeService.removeAllAliment(id);
      if (!fridge) {
        throw new NotFoundException('Fridge not found');
      }
      return { message: 'The fridge has been successfully emptied.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/aliment')
  @ApiOperation({ summary: 'Find all aliments from a fridge' })
  @ApiResponse({
    status: 200,
    description: 'JSON array of all aliments from a fridge.',
  })
  @ApiResponse({ status: 404, description: 'Fridge not found.' })
  async findAllAliment(@Param('id') id: string) {
    try {
      const fridge = await this.fridgeService.getAllAliments(id);
      if (!fridge) {
        throw new NotFoundException('Fridge not found');
      }
      return fridge;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/aliment/:tag')
  @ApiOperation({ summary: 'Find an aliment from a fridge' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the aliment from a fridge.',
  })
  @ApiResponse({ status: 404, description: 'Fridge or aliment not found.' })
  async findOneAliment(@Param('id') id: string, @Param('tag') tag: string) {
    try {
      const fridge = await this.fridgeService.findOneAliment(id, tag);
      if (!fridge) {
        throw new NotFoundException('Fridge or aliment not found');
      }
      return fridge;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('ia/call')
  @ApiOperation({ summary: 'call the ai to get a recipe' })
  @ApiResponse({ status: 200, description: 'json of the recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseInterceptors(FileInterceptor('image'))
  async callIA(
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ) {
    try {
      const result = this.fridgeService.callAI(image, request);
      if (!result) {
        throw new BadRequestException('Bad request');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
