import { DefaultDeserializer } from 'v8';
import { recipe_entity } from './recipe.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class recipeStep_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 60 })
  time: number;

  @ManyToOne(() => recipe_entity, (recipe) => recipe.recette, {
    onDelete: 'CASCADE',
  })
  recipe: recipe_entity;
}
