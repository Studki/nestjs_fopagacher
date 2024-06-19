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
import { TagService } from './tag.service';
import { createTagDto } from './dto/create-tag.dto';
import { updateTagDto } from './dto/update-tag.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

// controller for the tag entity
@Controller('/tag')
@ApiTags('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // CRUD operations for the tag entity
  @Get(':id')
  @ApiOperation({ summary: 'Find a tag by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the tag.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const tag = await this.tagService.findOne(id);
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }
      return tag;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all tags' })
  @ApiResponse({ status: 200, description: 'JSON array of all tags.' })
  @ApiResponse({ status: 404, description: 'No tags found.' })
  async findAll() {
    try {
      return this.tagService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createTagDto: createTagDto) {
    try {
      this.tagService.create(createTagDto);
      return 'The tag has been successfully created.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async update(@Param('id') id: string, @Body() updateTagDto: updateTagDto) {
    try {
      const tag = await this.tagService.update(id, updateTagDto);
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }
      return 'The tag has been successfully updated.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async remove(@Param('id') id: string) {
    try {
      const tag = await this.tagService.remove(id);
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }
      return 'The tag has been successfully deleted.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
