import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { user_entity } from 'src/user/entities/user.entity';

@Entity()
export class tag_entity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  tag: string;

  @ManyToMany(() => user_entity, (user) => user.tags)
  users: user_entity[];
}
