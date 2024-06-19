import { Controller, Get, Post, Put, Delete, Req } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/')
  @ApiOperation({ summary: 'Find all of the users calendars' })
  @ApiResponse({ status: 200, description: 'JSON object of the calendars.' })
  @ApiResponse({ status: 404, description: 'calendars not found.' })
  getAllEvents(@Req() request: Request) {
    return this.calendarService.findAll(request);
  }

  @Get('/:time')
  getEventByTime(time: string) {
    return this.calendarService.findByTime(time);
  }

  @Delete('/event/:id')
  deleteEvent(id: string) {
    return this.calendarService.deleteEvent(id);
  }
}
