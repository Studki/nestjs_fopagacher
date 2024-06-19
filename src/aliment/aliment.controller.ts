import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AlimentsService } from './aliment.service';
import { createAliment, PatchAlimentDto } from './dto/index';
import { aliment_entity } from './entities/aliment.entity';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('aliments')
export class AlimentController {
  constructor(private readonly alimentsService: AlimentsService) {}

  @Get()
  @ApiOperation({ summary: 'Find all aliments' })
  @ApiResponse({ status: 200, description: 'JSON array of all aliments.' })
  @ApiResponse({ status: 404, description: 'No aliments found.' })
  async getAllAliments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.alimentsService.getAllAliments(page, limit);
  }

  @Get('length')
  @ApiOperation({ summary: 'returns the number of product in the db' })
  @ApiResponse({ status: 200, description: 'number of products.' })
  @ApiResponse({ status: 404, description: 'No aliments found.' })
  async getAlimentsLength(): Promise<number> {
    return this.alimentsService.getNumberOfProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a aliment by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  @ApiResponse({ status: 404, description: 'Aliment not found.' })
  getOneAliment(@Param('id') id: string): Promise<aliment_entity> {
    return this.alimentsService.getOneAliment(id);
  }

  @Get('tag/:tag')
  @ApiOperation({ summary: 'Find a aliment by tag' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  @ApiResponse({ status: 404, description: 'Aliment not found.' })
  getAlimentByTag(@Param('tag') tag: string): Promise<aliment_entity> {
    return this.alimentsService.getAliment(tag);
  }

  @Post()
  @ApiOperation({ summary: 'Create a aliment' })
  @ApiResponse({ status: 201, description: 'json of the new aliment' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  createAliment(@Body() aliment: createAliment): Promise<aliment_entity> {
    return this.alimentsService.createAliment(aliment);
  }

  @Put(':tag')
  @ApiOperation({ summary: 'Update a aliment by tag' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  @ApiResponse({ status: 404, description: 'Aliment not found.' })
  updateAliment(
    @Param('tag') tag: string,
    @Body() aliment: PatchAlimentDto,
  ): Promise<aliment_entity> {
    return this.alimentsService.updateAliment(tag, aliment);
  }

  @Put('id/:id')
  @ApiOperation({ summary: 'Update a aliment by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  @ApiResponse({ status: 404, description: 'Aliment not found.' })
  updateOneAliment(
    @Param('id') id: string,
    @Body() aliment: PatchAlimentDto,
  ): Promise<aliment_entity> {
    return this.alimentsService.updateOneAliment(id, aliment);
  }

  @Delete(':tag')
  @ApiOperation({ summary: 'Delete a aliment by tag' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  deleteAliment(@Param('tag') tag: string): Promise<aliment_entity> {
    return this.alimentsService.deleteAliment(tag);
  }

  @Delete('id/:id')
  @ApiOperation({ summary: 'Delete a aliment by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  deleteOneAliment(@Param('id') id: string): Promise<aliment_entity> {
    return this.alimentsService.deleteOneAliment(id);
  }

  @Post('id/:id')
  @ApiOperation({ summary: 'Post a aliment by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  @ApiResponse({ status: 404, description: 'Aliment not found.' })
  postOneAliment(
    @Param('id') id: string,
    @Body() aliment: PatchAlimentDto,
  ): Promise<aliment_entity> {
    return this.alimentsService.postOneAliment(id, aliment);
  }
}
