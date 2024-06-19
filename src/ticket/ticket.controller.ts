import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { createTicketDto, PatchTicketDto } from './dto/index';
import { ticket_entity } from './entities/ticket.entity';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import axios from 'axios';

@Controller('tickets')
@ApiTags('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Get()
    @ApiOperation({ summary: 'Find all tickets' })
    @ApiResponse({ status: 200, description: 'JSON array of all tickets.' })
    @ApiResponse({ status: 404, description: 'No tickets found.' })
    async getAllTickets(): Promise<ticket_entity[]> {
        try {
            const tickets = await this.ticketService.getAllTickets();
            if (!tickets) {
                throw new NotFoundException('No tickets found');
            }
            return tickets;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get(':identifier')
    @ApiOperation({ summary: 'Find a ticket by id or by type or by a world' })
    @ApiResponse({ status: 200, description: 'JSON object of the ticket.' })
    @ApiResponse({ status: 404, description: 'Ticket not found.' })
    async getOneTicket(
        @Param('identifier') identifier: string,
    ): Promise<ticket_entity | ticket_entity[]> {
        try {
            // Check if the identifier is a number (id)
            if (!isNaN(+identifier)) {
                const ticket = await this.ticketService.getOneTicket(+identifier);
                if (!ticket) {
                    throw new NotFoundException('Ticket not found');
                }
                return ticket;
            }
            // If the identifier is not a number, assume it's a type or a world
            const ticket = await this.ticketService.getTicket(identifier);
            if (!ticket) {
                throw new NotFoundException('Ticket not found');
            }
            return ticket;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a ticket' })
    @ApiResponse({ status: 201, description: 'The ticket has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async createTicket(@Body() ticket: createTicketDto): Promise<ticket_entity> {
        try {
            const created = await this.ticketService.createTicket(ticket);
            await axios.post('https://discord.com/api/webhooks/1151162490617606244/NaiEBGliNh9cJ6S7DhHSbWjuE9fD0zezJEDR5fhA5zShoPCpFtNf0ZcjGCIXdOHQzCZu', {
                thread_name: created.title,
                content: created.description,
              });

            return created;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a ticket' })
    @ApiResponse({ status: 200, description: 'The ticket has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async patchTicket(
        @Param('id') id: number,
        @Body() ticket: PatchTicketDto,
    ): Promise<ticket_entity> {
        try {
            const created = await this.ticketService.patchTicket(id, ticket);
            if (!created) {
                throw new NotFoundException('Ticket not found');
            }
            return created;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a ticket' })
    @ApiResponse({ status: 200, description: 'The ticket has been successfully deleted.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async deleteTicket(@Param('id') id: number): Promise<ticket_entity> {
        try {
            return await this.ticketService.deleteTicket(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}