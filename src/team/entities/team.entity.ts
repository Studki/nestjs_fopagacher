import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { user_entity } from '../../user/entities/user.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class team_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  tag: string;

  @Column()
  description: string;

  @ManyToMany(() => user_entity, (user) => user.teams)
  @JoinTable()
  users: user_entity[];

  @ManyToMany(() => fridge_entity, (fridge) => fridge.teams)
  @JoinTable()
  fridges: fridge_entity[];
}
