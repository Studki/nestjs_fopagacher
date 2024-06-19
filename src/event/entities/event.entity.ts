import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { ItemQuantity } from './itemQuantity_entity.entity';

@Entity()
export class event_entity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  date: Date;

  @Column({ nullable: true })
  @ApiProperty()
  recipeID: string;

  @Column({ nullable: true })
  @ApiProperty()
  image: string;

  @Column({ nullable: true })
  @ApiProperty()
  title: string;

  @Column({ nullable: true })
  @ApiProperty()
  alimentID: string;

  @OneToMany(() => ItemQuantity, (itemQuantity) => itemQuantity.event)
  @JoinTable()
  itemQuantity: ItemQuantity[];

  @Column({ nullable: true })
  @ApiProperty()
  quantity: number;

  @ManyToOne(() => calendar_entity, (calendar) => calendar.event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  calendar: calendar_entity;

  @Column({ default: false })
  @ApiProperty()
  iaGenerated: boolean;
}
