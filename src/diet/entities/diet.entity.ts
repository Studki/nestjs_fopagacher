import { ApiProperty } from '@nestjs/swagger';
import { user_entity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class diet_entity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column({ nullable: true })
  @ApiProperty()
  image: string;

  @ManyToMany(() => user_entity, (user) => user.diets)
  users: user_entity[];
}
