import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { user_entity } from 'src/user/entities/user.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';

@Entity()
export class ustensile_entity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column({ nullable: true })
  @ApiProperty()
  image: string;

  @ManyToMany(() => user_entity, (user) => user.ustensiles)
  users: user_entity[];

  @ManyToMany(() => recipe_entity, (recipe) => recipe.ustensiles)
  recipes: recipe_entity[];
}
