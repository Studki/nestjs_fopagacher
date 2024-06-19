import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { createTicketDto, PatchTicketDto } from './dto/index';
import { ticket_entity } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TicketController', () => { 
    let controller: TicketController;
    let service: TicketService;
    let repository: Repository<ticket_entity>;

    beforeEach(async () => {
        const module:TestingModule = await Test.createTestingModule({
            controllers:  [TicketController],
            providers: [
                TicketService,
                {
                    provide: getRepositoryToken(ticket_entity),
                    useClass: Repository,
                },
            ],
        }).compile();

        controller = module.get<TicketController>(TicketController);
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
            jest.spyOn(service, 'getAllTickets').mockResolvedValue(ticket);

            const result = await controller.getAllTickets();

            expect(result).toBe(ticket);
        })
    })

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
            jest.spyOn(service, 'getOneTicket').mockResolvedValue(ticket);

            const result = await controller.getOneTicket('0');

            expect(result).toBe(ticket);
        })

        it ('should return a ticket if the identifier is a string', async () => {
            const ticket: ticket_entity[] = [{
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            }];
            jest.spyOn(service, 'getTicket').mockResolvedValue(ticket);

            const result = await controller.getOneTicket('test');

            expect(result).toBe(ticket);
        })
    })

    describe('createTicket', () => {
        it('should create a ticket', async () => {
            const ticket: createTicketDto = {
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
            };
            const createdTicket: ticket_entity = {
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            };
            jest.spyOn(service, 'createTicket').mockResolvedValue(createdTicket);

            const result = await controller.createTicket(ticket);

            expect(result).toBe(createdTicket);
        })
    })

    describe('updateTicket', () => {
        it('should update a ticket', async () => {
            const ticket: PatchTicketDto = {
                title: "test",
                status:"test",
                type:"dev",
                userAssigned:1
            };
            const updatedTicket: ticket_entity = {
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:1
            };
            jest.spyOn(service, 'patchTicket').mockResolvedValue(updatedTicket);

            const result = await controller.patchTicket(0, ticket);

            expect(result).toBe(updatedTicket);
        })
    })

    describe('deleteTicket', () => {
        it('should delete a ticket', async () => {
            const ticket: ticket_entity = {
                id: 0,
                title: "test",
                description: "test that",
                status:"test",
                type:"dev",
                userCreator:12,
                userAssigned:0
            };
            jest.spyOn(service, 'deleteTicket').mockResolvedValue(ticket);

            const result = await controller.deleteTicket(0);

            expect(result).toBe(ticket);
        })
    })
})