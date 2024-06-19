import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { item_entity } from 'src/item/entities/item.entity';
import { user_entity } from 'src/user/entities/user.entity';

@Entity()
export class list_entity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @OneToMany(() => item_entity, (item) => item.list)
  aliments: item_entity[];

  @ManyToMany(() => user_entity, (user) => user.lists)
  users: user_entity[];

  @Column({ nullable: true })
  @ApiProperty()
  image?: string;

  @Column({ nullable: true })
  fridgeId: string;
}
