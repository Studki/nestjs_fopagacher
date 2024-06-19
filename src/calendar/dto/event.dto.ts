import { ApiProperty } from "@nestjs/swagger";

export class EventDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;
}