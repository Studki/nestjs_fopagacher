import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { jest } from '@jest/globals'; // Import the 'jest' object

describe('CalendarController', () => {
    let controller: CalendarController;
    let service: CalendarService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CalendarController],
            providers: [CalendarService],
        }).compile();

        controller = module.get<CalendarController>(CalendarController);
        service = module.get<CalendarService>(CalendarService);
    });

    describe('getAllEvents', () => {
        it('should return all events', () => {
            const events = [{ id: '1', name: 'Event 1' }, { id: '2', name: 'Event 2' }];
            const request = { query: {} } as unknown as Request; // Create a mock Request object with 'unknown' type

            jest.spyOn(service, 'getAllEvents' as keyof CalendarService).mockReturnValue(events as never);

            const result = controller.getAllEvents(request); // Add the request argument here

            expect(result).toEqual(events);
        });
    });

    describe('getEventByTime', () => {
        it('should return the event with the specified time', () => {
            const time = '2022-01-01T00:00:00Z';
            const event = { id: '1', name: 'Event 1', time: '2022-01-01T00:00:00Z' };
            jest.spyOn(service, 'getEventByTime' as keyof CalendarService).mockReturnValue(event as never);

            const result = controller.getEventByTime(time);

            expect(result).toEqual(event);
        });
    });

    describe('deleteEvent', () => {
        it('should delete the event with the specified id', () => {
            const id = '1';
            jest.spyOn(service, 'deleteEvent').mockResolvedValue();

            controller.deleteEvent(id);

            expect(service.deleteEvent).toHaveBeenCalledWith(id);
        });
    });
});
