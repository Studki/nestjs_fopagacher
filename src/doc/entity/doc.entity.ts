import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class doc_entity {
    @PrimaryColumn()
    name: string;

    @Column({ type: 'bytea' })
    pdf: Buffer;
}