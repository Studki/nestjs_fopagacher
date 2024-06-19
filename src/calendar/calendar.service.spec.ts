import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarService } from './calendar.service';
import { calendar_entity } from './entities/calendar.entity';
import { user_entity } from 'src/user/entities/user.entity';

describe('CalendarService', () => {
    let service: CalendarService;
    let repository: Repository<calendar_entity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CalendarService,
                {
                    provide: getRepositoryToken(calendar_entity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<CalendarService>(CalendarService);
        repository = module.get<Repository<calendar_entity>>(
            getRepositoryToken(calendar_entity),
        );
    });

    describe('findOne', () => {
        it('should return a calendar entity by id', async () => {
            const calendarEntity: calendar_entity = { id: '1', title: 'Test Calendar' , user : {} as user_entity, item_event : [], event : []};
            jest.spyOn(repository, 'findOne').mockResolvedValue(calendarEntity);

            const result = await service.findOne('1');

            expect(result).toEqual(calendarEntity);
            expect(repository.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('findAll', () => {
        it('should return an array of calendar entities', async () => {
            const calendarEntities: calendar_entity[] = [
                { id: '1', title: 'Test Calendar' , user : {} as user_entity, item_event : [], event : []},
                { id: '2', title: 'Test Calendar 2' , user : {} as user_entity, item_event : [], event : []},
            ];
            jest.spyOn(repository, 'find').mockResolvedValue(calendarEntities);

            const result = await service.findAll({});

            expect(result).toEqual(calendarEntities);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findByTime', () => {
        it('should return a calendar entity by time', async () => {
            const time = '2022-01-01T00:00:00Z';
            const calendarEntity: calendar_entity = { id: '1', title: 'Test Calendar' , user : {} as user_entity, item_event : [], event : []};
            jest.spyOn(repository, 'findOne').mockResolvedValue(calendarEntity);

            const result = await service.findByTime(time);

            expect(result).toEqual(calendarEntity);
            expect(repository.findOne).toHaveBeenCalledWith({ time });
        });
    });

    describe('delete', () => {
        it('should delete a calendar entity by id', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

            await service.delete('1');

            expect(repository.delete).toHaveBeenCalledWith('1');
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event by id', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

            await service.deleteEvent('1');

            expect(repository.delete).toHaveBeenCalledWith('1');
        });
    });
});
