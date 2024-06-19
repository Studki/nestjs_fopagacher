import { item_entity } from 'src/item/entities/item.entity';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { user_entity } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { recipeStep_entity } from './recipe-details.entity';

@Entity()
export class recipe_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => user_entity, (user) => user.recipes)
  users: user_entity[];

  @ManyToMany(() => user_entity, (user) => user.favoritedRecipes)
  favoritedByUsers: user_entity[];

  @OneToMany(() => item_entity, (item) => item.recipe)
  aliments: item_entity[];

  @OneToMany(() => recipeStep_entity, (recipeStep) => recipeStep.recipe)
  recette: recipeStep_entity[];

  @Column()
  recipeOfTheDay: boolean;

  @ManyToMany(() => ustensile_entity, (ustensile) => ustensile.recipes)
  @JoinTable()
  ustensiles: ustensile_entity[];

  @Column({ nullable: true })
  image: string;

  @Column({ default: 600 })
  totalTime: number;
}
