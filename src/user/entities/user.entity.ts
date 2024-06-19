import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  Unique,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Role } from 'src/enums/roles.enum';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { team_entity } from 'src/team/entities/team.entity';
import { diet_entity } from 'src/diet/entities/diet.entity';
import { list_entity } from 'src/list/entities/list.entity';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { allergy_entity } from 'src/allergy/entities/allergy.entity';
import { SecureUserEntity } from './secure.user.entity';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email'])
@Unique(['username'])
export class user_entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  email: string;

  @Column({ default: false })
  verified: boolean;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: false })
  isSubcribed: boolean;

  @Column({ nullable: true, default: '' })
  image?: string;

  @Column({ nullable: true, default: '' })
  fcmToken?: string;

  @OneToOne(() => SecureUserEntity, (secureUser) => secureUser.user)
  secureUser: SecureUserEntity;

  @ManyToMany(() => tag_entity, (tag) => tag.users)
  @JoinTable()
  tags: tag_entity[];

  @ManyToMany(() => team_entity, (team) => team.users)
  teams: team_entity[];

  @Column({ default: 'undefined' })
  username: string;

  @Column({ default: true })
  notif_recipe: boolean;

  @Column({ default: true })
  notif_user: boolean;

  @Column({ default: true })
  notif_news: boolean;

  @Column({ default: true })
  notif_commercial: boolean;

  @Column({ default: true })
  email_recipe: boolean;

  @Column({ default: true })
  email_news: boolean;

  @Column({ default: true })
  email_commercial: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @ManyToMany(() => recipe_entity, (recipe) => recipe.users)
  @JoinTable()
  recipes: recipe_entity[];

  @ManyToMany(() => recipe_entity, (recipe) => recipe.favoritedByUsers)
  @JoinTable()
  favoritedRecipes: recipe_entity[];

  @ManyToMany(() => ustensile_entity, (ustensile) => ustensile.users)
  @JoinTable()
  ustensiles: ustensile_entity[];

  @ManyToMany(() => diet_entity, (diet) => diet.users)
  @JoinTable()
  diets: diet_entity[];

  @ManyToMany(() => fridge_entity, (fridge) => fridge.users)
  @JoinTable()
  fridges: fridge_entity[];

  @ManyToMany(() => list_entity, (list) => list.users)
  @JoinTable()
  lists: list_entity[];

  @OneToOne(() => calendar_entity, (calendar) => calendar.user)
  calendar: calendar_entity;

  @ManyToMany(() => allergy_entity, (allergy) => allergy.users)
  @JoinTable()
  allergies: allergy_entity[];

  @Column({ default: false })
  isOauth2: boolean;
}
