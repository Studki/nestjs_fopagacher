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
import { DateService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDateDto } from './dto/update-event.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/shared/public.decorator';
import { event_entity } from './entities/event.entity';

// controller for the date entity
@Controller('date')
@ApiTags('date')
export class DateController {
  constructor(private readonly dateService: DateService) {}

  @Public()
  @Get('current')
  @ApiOperation({ summary: 'Find the current date' })
  @ApiResponse({ status: 200, description: 'JSON object of the date.' })
  @ApiResponse({ status: 404, description: 'Date not found.' })
  async findCurrent() {
    try {
      const date = await this.dateService.findCurrent();
      if (!date) {
        throw new NotFoundException('Date not found');
      }
      return date;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/itemQuantity/')
  @ApiOperation({ summary: 'Find an itemQuantity by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the itemQuantity.' })
  @ApiResponse({ status: 404, description: 'ItemQuantity not found.' })
  async finditemQuantity(@Param('id') id: string) {
    try {
      const itemQuantity = await this.dateService.finditemQuantity(id);
      if (!itemQuantity) {
        throw new NotFoundException('ItemQuantity not found');
      }
      return itemQuantity;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a date by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the date.' })
  @ApiResponse({ status: 404, description: 'Date not found.' })
  async findOne(@Param('id') id: string, @Req() request: Request) {
    try {
      const date = await this.dateService.findOne(id, request);
      if (!date) {
        throw new NotFoundException('Date not found');
      }
      return date;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post()
  @ApiOperation({ summary: 'Create a date' })
  @ApiResponse({
    status: 201,
    description: 'The date has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ): Promise<event_entity> {
    try {
      return this.dateService.create(createEventDto, request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a date' })
  @ApiResponse({
    status: 200,
    description: 'The date has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Date not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDateDto: UpdateDateDto,
    @Req() request: Request,
  ) {
    try {
      const date = await this.dateService.update(id, updateDateDto, request);
      if (!date) {
        throw new NotFoundException('Date not found');
      }
      return { message: 'The date has been successfully updated.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a date' })
  @ApiResponse({
    status: 200,
    description: 'The date has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Date not found.' })
  async remove(@Param('id') id: string, @Req() request: Request) {
    try {
      await this.dateService.remove(id, request);
      return { message: 'The date has been successfully deleted.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all dates that have past' })
  @ApiResponse({
    status: 200,
    description: 'The dates have been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Dates not found.' })
  async removeAll() {
    try {
      const date = await this.dateService.removeAllOld();
      if (!date) {
        throw new NotFoundException('Dates not found');
      }
      return 'The dates have been successfully deleted.';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
