import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { itemService } from './item.service';
import { request } from 'http';
import { CreateItem } from './dto/create-item.dto';
import { item_entity } from './entities/item.entity';
import { AdditemToFridgeDto } from './dto/add-item-to-fridge.dto';
import { AdditemToListDto } from './dto/add-item-to-list.dto';
import { RemoveitemFromFridgeDto } from './dto/remove-item-from-fridge.dto';
import { RemoveitemFromListDto } from './dto/remove-item-from-list.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CheckItemDto } from './dto/check-item.dto';

@Controller('item')
export class itemController {
  constructor(private readonly itemService: itemService) {}

  @Post()
  @ApiOperation({ summary: 'Create an item' })
  @ApiResponse({
    status: 201,
    description: 'json of the new aliment in fridge and/or list',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  createAliment(
    @Req() request: Request,
    @Body() createitem: CreateItem,
  ): Promise<item_entity[]> {
    try {
      const result = this.itemService.createitem(request, createitem);
      if (!result) {
        throw new BadRequestException('Aliment not created');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('fridge')
  @ApiOperation({ summary: 'Add a aliment to fridge' })
  @ApiResponse({
    status: 201,
    description: 'json of the new aliment in fridge',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  addAlimentToFridge(
    @Req() request: Request,
    @Body() additemToFridgeDto: AdditemToFridgeDto,
  ): Promise<item_entity> {
    try {
      const result = this.itemService.additemToFridge(
        request,
        additemToFridgeDto,
      );
      if (!result) {
        throw new BadRequestException('Aliment not added to fridge');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('list')
  @ApiOperation({ summary: 'Add a aliment to list' })
  @ApiResponse({
    status: 201,
    description: 'json of the new aliment in list',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  addAlimentToList(
    @Req() request: Request,
    @Body() additemToListDto: AdditemToListDto,
  ): Promise<item_entity> {
    try {
      const result = this.itemService.additemToList(request, additemToListDto);
      if (!result) {
        throw new BadRequestException('Aliment not added to list');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('check')
  @ApiOperation({ summary: 'Check item' })
  @ApiResponse({
    status: 200,
    description: 'The item.s have been successfully checked.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async checkUncheckItems(@Body() checkItemDto: CheckItemDto) {
    try {
      const result = await this.itemService.checkItems(
        checkItemDto.itemsId,
        checkItemDto.checked,
      );
      if (result !== true) {
        throw new BadRequestException(`Items not updated`);
      }
      return { message: 'Items updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('quantities')
  @ApiOperation({ summary: 'Update one or many item.s' })
  @ApiResponse({
    status: 200,
    description: 'The item.s have been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async updateItems(
    @Body() updateItemsDto: UpdateItemDto,
  ): Promise<item_entity[]> {
    try {
      const result = await this.itemService.updateItemQuantities(
        updateItemsDto.itemsId,
        updateItemsDto.quantities,
      );
      if (!result || result.length === 0) {
        throw new BadRequestException('Items not updated');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('list')
  @ApiOperation({ summary: 'Remove items from list' })
  @ApiResponse({
    status: 200,
    description: 'The items have been successfully removed from the list.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async removeItemsFromList(
    @Req() request: Request,
    @Body() removeItemsFromListDto: RemoveitemFromListDto,
  ): Promise<item_entity[]> {
    try {
      const result = await this.itemService.removeItemsFromList(
        request,
        removeItemsFromListDto,
      );
      if (!result || result.length === 0) {
        throw new BadRequestException('Items not removed from list');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('fridge')
  @ApiOperation({ summary: 'Remove items from fridge' })
  @ApiResponse({
    status: 200,
    description: 'The items have been successfully removed from the fridge.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async removeItemsFromFridge(
    @Req() request: Request,
    @Body() removeItemsFromFridgeDto: RemoveitemFromFridgeDto,
  ): Promise<item_entity[]> {
    try {
      const result = await this.itemService.removeItemsFromFridge(
        request,
        removeItemsFromFridgeDto,
      );
      if (!result || result.length === 0) {
        throw new BadRequestException('Items not removed from fridge');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Find all items' })
  @ApiResponse({ status: 200, description: 'JSON array of items.' })
  @ApiResponse({ status: 404, description: 'Aliments not found.' })
  getAllItems(): Promise<item_entity[]> {
    return this.itemService.getAllItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a aliment in fridge by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the aliment.' })
  @ApiResponse({ status: 404, description: 'Aliment not found.' })
  getOneAliment(@Param('id') id: string): string {
    return `getOneAliment ${id}`;
  }

  @Get('used-date/:id')
  @ApiOperation({ summary: 'Find all items used by recipes' })
  @ApiResponse({ status: 200, description: 'JSON array of items.' })
  @ApiResponse({ status: 404, description: 'Items not found.' })  
  findAllQuantityUsedByRecipes(@Param('id') id: string) {
    return this.itemService.getItemUtilizationDate(id);
  }
}
