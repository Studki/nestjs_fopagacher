import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { createTicketDto, PatchTicketDto } from './dto/index';
import { ticket_entity } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TicketService', () => {
    let service: TicketService;
    let repository: Repository<ticket_entity>;

    beforeEach(async () => {
        const module:TestingModule = await Test.createTestingModule({
            providers: [
                TicketService,
                {
                    provide: getRepositoryToken(ticket_entity),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findOneOrFail: jest.fn(),
                        save: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TicketService>(TicketService);
        repository = module.get<Repository<ticket_entity>>(getRepositoryToken(ticket_entity),);
    });

    describe('getAllTicket', () => {
        it('should return an array of all the tickets', async () => {
            const ticket: ticket_entity[]= [
                {
                    id: 0,
                    title: "test",
                    description: "test that",
                    status:"test",
                    type:"dev",
                    userCreator:12,
                    userAssigned:0
                }
            ];
            jest.spyOn(repository, 'find').mockResolvedValue(ticket);

            const result = await service.getAllTickets();

            expect(result).toBe(ticket);
        })
    });

    describe('getOneTicketByIdentifier', () => {
        it('should return a ticket if the identifier is anumber', async () => {
            const ticket: ticket_entity = {
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            };
            jest.spyOn(repository, 'findOne').mockResolvedValue(ticket);

            const result = await service.getOneTicket(0);

            expect(result).toBe(ticket);
        });

        it('should return a ticket if the identifier is a string', async () => {
            const ticket: ticket_entity = {
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            };
            jest.spyOn(repository, 'findOne').mockResolvedValue(ticket);

            const result = await service.getTicket("test");

            expect(result).toBe(ticket);
        });

        it('should throw a NotFoundException if the ticket is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

            await expect(service.getOneTicket(0)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTicket', () => {
        it('should create a ticket', async () => {
            const ticket: createTicketDto = {
                title: "gitlab down",
                description: "le gitlab est surment down des test unitaire sont en cour",
                status:"test",
                type:"dev",
                userCreator:12,
            };
            const createdTicket: ticket_entity = {
                id: 0,
                title: "gitlab down",
                description: "le gitlab est surment down des test unitaire sont en cour",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            };
            jest.spyOn(repository, 'save').mockResolvedValue(createdTicket);

            const result = await service.createTicket(ticket);

            expect(result).toBe(createdTicket);
        });
    });


    describe('patchTicket', () => {
        it('should update a ticket', async () => {
            const ticket: PatchTicketDto = {
                title: "test",
                status:"test",
                type:"dev",
                userAssigned:0
            };
            const updatedTicket: ticket_entity = {
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            };
            jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(updatedTicket);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedTicket);

            const result = await service.patchTicket(0, ticket);

            expect(result).toBe(updatedTicket);
        });
    });
});
