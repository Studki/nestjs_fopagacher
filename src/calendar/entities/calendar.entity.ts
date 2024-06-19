import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { user_entity } from 'src/user/entities/user.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { event_entity } from 'src/event/entities/event.entity';

@Entity()
export class calendar_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToOne(() => user_entity, (user) => user.calendar, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: user_entity;

  @OneToMany(() => item_entity, (item) => item.calendar)
  item_event: item_entity[];

  @OneToMany(() => event_entity, (event) => event.calendar)
  event: event_entity[];
}
