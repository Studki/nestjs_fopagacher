import { ApiProperty } from '@nestjs/swagger';
export class PatchTicketDto {
    @ApiProperty()
    title?: string;
    @ApiProperty()
    status?: string;
    @ApiProperty()
    type?: string;
    @ApiProperty()
    userAssigned?: number;
}