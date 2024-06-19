import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ticket_entity } from './entities/ticket.entity';
import { createTicketDto, PatchTicketDto } from './dto/index';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(ticket_entity)
        private readonly ticketRepository: Repository<ticket_entity>,
    ) {}

    async getAllTickets(): Promise<ticket_entity[]> {
        return await this.ticketRepository.find();
    }

    async getOneTicket(id: number): Promise<ticket_entity> {
        return await this.ticketRepository.findOne({ where: { id } });
    }

    async getTicket(type: string): Promise<ticket_entity[]> {
        return await this.ticketRepository.find({ where: { type } });
    }

    async createTicket(ticket: createTicketDto): Promise<ticket_entity> {
        const newTicket = new ticket_entity();
        newTicket.title = ticket.title;
        newTicket.description = ticket.description;
        newTicket.status = ticket.status;
        newTicket.type = ticket.type;
        newTicket.userCreator = ticket.userCreator;
        newTicket.userAssigned = 0;

        return await this.ticketRepository.save(newTicket);
    }

    async patchTicket(id: number, ticket: PatchTicketDto): Promise<ticket_entity> {
        const ticketToUpdate = await this.ticketRepository.findOne({
            where: { id },
        });
        ticketToUpdate.title = ticket?.title;
        ticketToUpdate.status = ticket?.status;
        ticketToUpdate.type = ticket?.type;
        ticketToUpdate.userAssigned = ticket?.userAssigned;
        return await this.ticketRepository.save(ticketToUpdate);
    }

    async deleteTicket(id: number): Promise<ticket_entity> {
        const ticketToDelete = await this.ticketRepository.findOne({
            where: { id },
        });
        return await this.ticketRepository.remove(ticketToDelete);
    }
}
