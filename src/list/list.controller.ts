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
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('list')
@ApiTags('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get('images')
  @ApiOperation({ summary: 'Get images' })
  @ApiResponse({ status: 200, description: 'Array of images.' })
  async getImages(): Promise<string[]> {
    try {
      const images = await this.listService.getImages();
      return images;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all list by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the list.' })
  @ApiResponse({ status: 404, description: 'List not found.' })
  async findAll(@Req() request: Request) {
    try {
      const list = await this.listService.findAll(request);
      if (!list) {
        throw new NotFoundException('List not found');
      }
      return list;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a list by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the list.' })
  @ApiResponse({ status: 404, description: 'List not found.' })
  async findOne(@Req() request: Request, @Param('id') id: string) {
    try {
      const list = await this.listService.findOne(request, id);
      if (!list) {
        throw new NotFoundException('List not found');
      }
      return list;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a list' })
  @ApiResponse({
    status: 201,
    description: 'The list has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Req() request: Request, @Body() createListDto: CreateListDto) {
    try {
      return this.listService.create(request, createListDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a list' })
  @ApiResponse({
    status: 200,
    description: 'The list has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'List not found.' })
  async update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    try {
      const list = await this.listService.update(id, updateListDto);
      if (!list) {
        throw new NotFoundException('List not found');
      }
      return { message: 'The list has been successfully updated.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a list' })
  @ApiResponse({
    status: 200,
    description: 'The list has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'List not found.' })
  async remove(@Param('id') id: string) {
    try {
      const list = await this.listService.remove(id);
      if (!list) {
        throw new NotFoundException('List not found');
      }
      return { remove: 'The list has been successfully deleted.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('send-to-fridge/:id')
  @ApiOperation({ summary: 'Send item checked to fridge' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully sent to fridge.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item was not able to be put in the fridge.',
  })
  async sentAlimentToFrige(@Req() request: Request, @Param('id') id: string) {
    try {
      return this.listService.sendToFridge(request, id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
