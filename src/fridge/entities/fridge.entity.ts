import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { team_entity } from 'src/team/entities/team.entity';
import { user_entity } from 'src/user/entities/user.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { image_entity } from 'src/image/entity/image-file.entity';
@Entity()
export class fridge_entity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  image?: string;

  @OneToMany(() => item_entity, (item) => item.fridge)
  aliments: item_entity[];

  @ManyToMany(() => user_entity, (user) => user.fridges)
  users: user_entity[];

  @ManyToMany(() => team_entity, (team) => team.fridges)
  teams: team_entity[];
}
