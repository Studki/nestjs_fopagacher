import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { list_entity } from 'src/list/entities/list.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { ItemQuantity } from 'src/event/entities/itemQuantity_entity.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { join } from 'path';

@Entity()
export class item_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => aliment_entity, (aliment) => aliment.recipes)
  aliment: aliment_entity;

  @ManyToOne(() => list_entity, (list) => list.aliments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  list: list_entity;

  @ManyToOne(() => fridge_entity, (fridge) => fridge.aliments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  fridge: fridge_entity;

  @ManyToOne(() => recipe_entity, (recipe) => recipe.aliments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  recipe: recipe_entity;

  @ManyToOne(() => ItemQuantity, (itemQuantity) => itemQuantity.item, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  item_recipe: ItemQuantity;

  @Column({ default: false })
  isChecked: boolean;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  expirationDate: Date;

  @ManyToOne(() => calendar_entity, (calendar) => calendar.item_event, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  calendar: calendar_entity;
}
