import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { event_entity } from 'src/event/entities/event.entity';
import { item_entity } from 'src/item/entities/item.entity';

@Entity()
export class ItemQuantity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => event_entity, (event) => event.itemQuantity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  event: event_entity;

  @ManyToOne(() => item_entity, (item) => item.item_recipe)
  item: item_entity;

  @Column({ default: '' })
  @ApiProperty()
  fridgeId: string;

  @Column({ default: '' })
  @ApiProperty()
  listId: string;

  @Column()
  quantity: number;
}
