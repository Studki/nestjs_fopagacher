import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class issue_entity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @ApiProperty()
    title: string;

    @Column()
    @ApiProperty()
    description: string;

    @Column()
    @ApiProperty()
    email: string;
}