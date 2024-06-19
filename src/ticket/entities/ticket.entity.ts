import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class ticket_entity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    title: string;

    @Column()
    @ApiProperty()
    description: string;

    @Column()
    @ApiProperty()
    status: string;

    @Column()
    @ApiProperty()
    type: string;

    @Column()
    @ApiProperty()
    userCreator: number;

    @Column()
    @ApiProperty()
    userAssigned?: number;
}