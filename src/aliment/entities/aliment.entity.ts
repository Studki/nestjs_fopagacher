import { item_entity } from 'src/item/entities/item.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class aliment_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Empty', nullable: true })
  title: string;

  @Column({ default: 'Empty', nullable: true })
  description: string;

  @Column({ default: 0, nullable: true })
  price: number;

  @Column({ default: 'Empty', nullable: true })
  image: string;

  @Column({ default: 'Empty', nullable: true })
  category: string;

  @Column({ default: 'Empty', nullable: true })
  tag: string;

  @OneToMany(() => item_entity, (item) => item.aliment)
  items: item_entity[];

  @ManyToMany(() => recipe_entity, (recipe) => recipe.aliments)
  recipes: recipe_entity[];

  @Column({ default: 'Empty', nullable: true })
  unit: string;
}
