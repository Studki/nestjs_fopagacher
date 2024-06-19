import { Module, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../Config/database.config';
import { UsersController } from '../user/user.controller';
import { UsersService } from '../user/user.service';
import { team_entity } from '../team/entities/team.entity';
import { user_entity } from '../user/entities/user.entity';
import { TeamController } from '../team/team.controller';
import { TeamService } from '../team/team.service';
import { event_entity } from '../event/entities/event.entity';
import { recipe_entity } from '../recipe/entities/recipe.entity';
import { DateController } from '../event/event.controller';
import { RecipeController } from '../recipe/recipe.controller';
import { DateService } from '../event/event.service';
import { RecipeService } from '../recipe/recipe.service';
import { AlimentsService } from '../aliment/aliment.service';
import { AlimentController } from '../aliment/aliment.controller';
import { aliment_entity } from '../aliment/entities/aliment.entity';
import { FridgeController } from 'src/fridge/fridge.controller';
import { FridgeService } from 'src/fridge/fridge.service';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { UstensileController } from 'src/ustensile/ustensile.controller';
import { UstensileService } from 'src/ustensile/ustensile.service';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { TicketController } from 'src/ticket/ticket.controller';
import { TicketService } from 'src/ticket/ticket.service';
import { ticket_entity } from 'src/ticket/entities/ticket.entity';
import { ListController } from 'src/list/list.controller';
import { ListService } from 'src/list/list.service';
import { list_entity } from 'src/list/entities/list.entity';
import { TagController } from 'src/tag/tag.controller';
import { TagService } from 'src/tag/tag.service';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { DietController } from 'src/diet/diet.controller';
import { DietService } from 'src/diet/diet.service';
import { diet_entity } from 'src/diet/entities/diet.entity';
import { AllergyController } from 'src/allergy/allergy.controller';
import { AllergyService } from 'src/allergy/allergy.service';
import { allergy_entity } from 'src/allergy/entities/allergy.entity';
import { issueController } from 'src/issue/issue.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RolesGuard } from 'src/roles/roles.guard';
import { Connection } from 'typeorm';
import { quizz_entity } from 'src/quizz/entities/quizz.entity';
import { QuizzController } from 'src/quizz/quizz.controller';
import { QuizzService } from 'src/quizz/quizz.service';
import { IssueService } from 'src/issue/issue.service';
import { MailController } from 'src/mail/mail.controller';
import { MailService } from 'src/mail/mail.service';
import { token_entity } from 'src/mail/entities/token.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { itemController } from 'src/item/item.controller';
import { itemService } from 'src/item/item.service';
import { image_entity } from 'src/image/entity/image-file.entity';
import { ImageService } from 'src/image/image.service';
import { ImageController } from 'src/image/image.controller';
import { CalendarController } from 'src/calendar/calendar.controller';
import { CalendarService } from 'src/calendar/calendar.service';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { SeedService } from 'src/seed/seed.service';
import { DocController } from 'src/doc/doc.controller';
import { DocService } from 'src/doc/doc.service';
import { doc_entity } from 'src/doc/entity/doc.entity';
import { ItemQuantity } from 'src/event/entities/itemQuantity_entity.entity';
import { recipeStep_entity } from 'src/recipe/entities/recipe-details.entity';
import { SecureUserEntity } from 'src/user/entities/secure.user.entity';
import { DeepLinkController } from 'src/deeplink/deeplinking.controller';
import {  PaymentService, PaymentController } from 'src/payment/payment';

@Injectable()
export class DatabaseHealthService implements OnApplicationBootstrap {
  constructor(private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    try {
      await this.connection.query('SELECT 1');
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Failed to connect to the database:', error.message);
    }
  }
}

type AllowedDatabaseType =
  | 'postgres'
  | 'mysql'
  | 'mariadb'
  | 'sqlite'
  | 'mssql';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'mail.patzenhoffer.eu',
        port: 587,
        secure: false,
        auth: {
          user: 'noreply@patzenhoffer.eu',
          pass: 'MArz4Taqq5eWFwe!',
        },
      },
      defaults: {
        from: '"Fopagacher" <noreply@patzenhoffer.eu>',
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('database.type') as AllowedDatabaseType,
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.databaseName'),
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
          user_entity,
          team_entity,
          event_entity,
          recipe_entity,
          fridge_entity,
          ustensile_entity,
          ticket_entity,
          list_entity,
          tag_entity,
          diet_entity,
          allergy_entity,
          token_entity,
          quizz_entity,
          issueController,
          item_entity,
          image_entity,
          calendar_entity,
          doc_entity,
          ItemQuantity,
          recipeStep_entity,
          ,
          SecureUserEntity,
        ],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      user_entity,
      event_entity,
      recipe_entity,
      team_entity,
      aliment_entity,
      fridge_entity,
      ustensile_entity,
      ticket_entity,
      list_entity,
      tag_entity,
      diet_entity,
      allergy_entity,
      token_entity,
      quizz_entity,
      issueController,
      item_entity,
      image_entity,
      calendar_entity,
      doc_entity,
      ItemQuantity,
      recipeStep_entity,
      SecureUserEntity,
    ]),
  ],
  controllers: [
    UsersController,
    TeamController,
    DateController,
    RecipeController,
    AlimentController,
    FridgeController,
    UstensileController,
    TicketController,
    ListController,
    TagController,
    DietController,
    AllergyController,
    QuizzController,
    issueController,
    MailController,
    itemController,
    ImageController,
    CalendarController,
    DocController,
    DeepLinkController,
    PaymentController
  ],
  providers: [
    UsersService,
    TeamService,
    DateService,
    RecipeService,
    AlimentsService,
    FridgeService,
    UstensileService,
    TicketService,
    ListService,
    TagService,
    DietService,
    AllergyService,
    QuizzService,
    IssueService,
    itemService,
    ImageService,
    SeedService,
    DatabaseHealthService,
    CalendarService,
    MailService,
    DocService,
    PaymentService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
