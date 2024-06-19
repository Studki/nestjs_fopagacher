import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class createTicketDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid title' })
    title: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid description' })
    description: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid status' })
    status: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Please enter a valid type' })
    type: string;
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Please enter a valid user creator' })
    userCreator: number;
}