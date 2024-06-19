import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calendar_entity } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { EventDto } from './dto/event.dto';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(calendar_entity)
    private calendarRepository: Repository<calendar_entity>,
  ) {}

  async findOne(id: string): Promise<calendar_entity> {
    return await this.calendarRepository.findOne({
      where: { id },
      relations: ['user', 'item_event', 'event'],
    });
  }

  // @Role(Role.ADMIN)
  async findAll(req: any): Promise<calendar_entity> {
    return await this.calendarRepository.findOne({
      where: { user: { id: req.user.sub } },
      relations: ['user', 'item_event', 'event', 'event.itemQuantity'],
    });
  }

  async findByTime(time: string) {
    if (time == 'today') {
      const item_event = await this.calendarRepository.find({
        where: { item_event: { expirationDate: new Date() } },
        relations: ['item_event'],
      });
      const event = await this.calendarRepository.find({
        where: { event: { date: new Date() } },
        relations: ['event'],
      });
      return [...item_event, ...event];
    }
    if (time == 'week') {
      //find all events for the week
      const week = new Date();
      week.setDate(week.getDate() + 7);
      //find all events that are before the end of the week
      const item_event = await this.calendarRepository.find({
        where: { item_event: { expirationDate: week } },
        relations: ['item_event'],
      });
      const event = await this.calendarRepository.find({
        where: { event: { date: week } },
        relations: ['event'],
      });
      return [...item_event, ...event];
    }
  }

  async delete(id: string): Promise<void> {
    await this.calendarRepository.delete(id);
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.calendarRepository.findOne({
      where: { id },
      relations: ['user', 'item_event', 'event'],
    });
    await this.calendarRepository.remove(event);
  }
}
