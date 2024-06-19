import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { user_entity } from './entities/user.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { createUser, PatchUserDto, getUser } from './dto/index';
import { rejects } from 'assert';
import { JwtService } from '@nestjs/jwt';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { addTagToUserDto } from './dto/add-tag-to-user.dto';
import { AddRecipeToUserDto } from './dto/add-recipe-to-user.dto';
import { FavoriteRecipeDto } from './dto/add-fav-recipe-to-user.dto';
// import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { AddUstensilesDto } from './dto/add-ustensile-to-user.dto';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { token_entity } from 'src/mail/entities/token.entity';
import { diet_entity } from 'src/diet/entities/diet.entity';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { PatchUserAllergy } from './dto/patch-user-allergy.dto';
import { allergy_entity } from 'src/allergy/entities/allergy.entity';
import { NotificationUserDto } from './dto/notification-to-user.dto';
import { SecureUserEntity } from './entities/secure.user.entity';
import { OauthDto } from './dto/oauth.login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,

    @InjectRepository(tag_entity)
    private readonly tagRepository: Repository<tag_entity>,

    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,

    @InjectRepository(ustensile_entity)
    private readonly ustensileRepository: Repository<ustensile_entity>,

    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,

    @InjectRepository(token_entity)
    private readonly tokenRepository: Repository<token_entity>,

    @InjectRepository(diet_entity)
    private readonly dietRepository: Repository<diet_entity>,

    @InjectRepository(calendar_entity)
    private calendarRepository: Repository<calendar_entity>,
    @InjectRepository(allergy_entity)
    private readonly allergyRepository: Repository<allergy_entity>,

    @InjectRepository(SecureUserEntity)
    private readonly secureUserRepository: Repository<SecureUserEntity>,

    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<getUser[]> {
    const users = await this.userRepository.find({ relations: ['secureUser'] });
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  async getOneUser(id: string): Promise<user_entity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'tags',
        'favoritedRecipes',
        'recipes',
        'ustensiles',
        'teams',
        'diets',
        'fridges',
        'lists',
        'calendar',
        'allergies',
        'calendar.item_event',
        'calendar.event',
        'calendar.event.itemQuantity',
        'calendar.event.itemQuantity.item',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getOneUserEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        return user;
      }
      throw new Error('User not found');
    } catch (err) {
      throw err;
    }
  }

  async updateUserPassword(id: string, password: string): Promise<user_entity> {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
    });
    userToUpdate.password = password;
    return await this.userRepository.save(userToUpdate);
  }

  async getUserAllergies(user: any): Promise<allergy_entity[]> {
    const myUserId = user.user.sub;
    const myUser = await this.userRepository.findOne({
      where: { id: myUserId },
      relations: ['allergies'],
    });

    if (!myUser) {
      throw new NotFoundException('User not found');
    }

    return myUser.allergies;
  }

  async deleteAllergiesForUser(request: any, allergiesToDelete: string[]) {
    const userId = request.user.sub;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['allergies'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    for (const title of allergiesToDelete) {
      const allergy = await this.allergyRepository.findOne({
        where: { title },
      });

      if (allergy) {
        user.allergies = user.allergies.filter(
          (allergyEntity) => allergyEntity.id !== allergy.id,
        );
      }
    }

    await this.userRepository.save(user);
    return user;
  }

  async getRecipesMatchingFridgeContents(
    request: any,
  ): Promise<recipe_entity[]> {
    const userId: string = request.user.sub;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['fridges', 'fridges.aliments', 'fridges.aliments.aliment'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.fridges) {
      throw new BadRequestException('User has no fridge');
    }

    if (user.fridges.length === 0) {
      throw new BadRequestException('User has no fridge');
    }

    for (const fridge of user.fridges) {
      if (fridge.aliments.length === 0) {
        throw new BadRequestException('User has no aliments in his/her fridge');
      }
    }

    const fridgeIngredients = user.fridges
      .flatMap((fridge) => fridge.aliments)
      .filter((item) => item.aliment)
      .map((item) => item.aliment.id);

    const uniqueIngredients = Array.from(new Set(fridgeIngredients));

    const matchingRecipes = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoin('recipe.aliments', 'item')
      .leftJoin('item.aliment', 'aliment')
      .where('aliment.id IN (:...ingredients)', {
        ingredients: uniqueIngredients,
      })
      .select('recipe.id')
      .addGroupBy('recipe.id')
      .having('COUNT(recipe.id) >= 3')
      .getMany();

    const recipeIds = matchingRecipes.map((entry) => entry.id);

    if (recipeIds.length > 0) {
      const fullRecipes = await this.recipeRepository.find({
        where: {
          id: In(recipeIds),
        },
        relations: ['aliments', 'aliments.aliment'],
      });

      return fullRecipes;
    }

    return [];
  }

  async resetUserPassword(
    token: string,
    password: string,
  ): Promise<user_entity> {
    try {
      const uuid = await this.tokenRepository.findOne({ where: { token } });
      if (!uuid) {
        throw new Error('Token not found');
      }
      const userToUpdate = await this.userRepository.findOneOrFail({
        where: { id: uuid.uuid },
      });
      userToUpdate.password = password;
      await this.tokenRepository.delete({ token });
      return await this.userRepository.save(userToUpdate);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  /*async updateNotificationForUser(
    user: any,
    notification: NotificationUserDto,
  ) {
    const userId = user.user.sub;
    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    Object.keys(notification).forEach((key) => {
      if (notification[key] !== undefined) {
        userEntity[key] = notification[key];
      }
    });

    await this.userRepository.save(userEntity);
    return userEntity;
  }*/

  async updateAllergiesForUser(
    userlolilol: any,
    allergiesToAdd: string[],
  ): Promise<user_entity> {
    const userId = userlolilol.user.sub;
    allergiesToAdd = allergiesToAdd || [];

    if (allergiesToAdd.length === 0) {
      throw new UnauthorizedException('No allergies to add or remove');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['allergies'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.allergies = [];

    for (const title of allergiesToAdd) {
      const allergy = await this.allergyRepository
        .createQueryBuilder('allergy')
        .where('LOWER(allergy.title) = LOWER(:title)', { title })
        .getOne();

      if (allergy) {
        user.allergies.push(allergy);
        await this.userRepository.save(user);
      }
    }

    await this.userRepository.save(user);
    return user;
  }

  async createUser(user: createUser): Promise<{
    access_token: string;
    id: string;
    email: string;
    verified: boolean;
    username: string;
    firstname: string;
    lastname: string;
    image: string;
    notif_user: boolean;
    notif_news: boolean;
    notif_commercial: boolean;
    notif_recipe: boolean;
    email_recipe: boolean;
    email_news: boolean;
    email_commercial: boolean;
  }> {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const PASSWORD_RGX =
      /^(?=.*[!@#$%^&()\-_=+{}[\]|:;'",.<>/?])(?=.*\d)(?=.*[A-Z]).{8,}$/;
    // At least one special character from the provide set.
    // At least one digit.
    // At least one uppercase letter.
    // A minimum length of 8 characters.

    if (!user.email || !user.password || !user.username) {
      throw new UnauthorizedException('Missing email, password or username');
    }

    if (!emailRegex.test(user.email)) {
      throw new UnauthorizedException('Invalid email format');
    }

    if (!PASSWORD_RGX.test(user.password)) {
      throw new UnauthorizedException('Invalid password format');
    }

    if (await this.userRepository.findOne({ where: { email: user.email } })) {
      throw new UnauthorizedException('Email already used');
    }

    if (
      await this.userRepository.findOne({ where: { username: user.username } })
    ) {
      throw new UnauthorizedException('Username already used');
    }

    const newUser = new user_entity();
    newUser.lastname = user.lastname;
    newUser.firstname = user.firstname;
    newUser.email = user.email;
    newUser.verified = false;
    newUser.username = user.username;
    newUser.password = user.password;
    newUser.teams = [];
    newUser.isOauth2 = false;
    newUser.notif_commercial = true;
    newUser.notif_news = true;
    newUser.notif_recipe = true;
    newUser.notif_user = true;
    const newCalendar = new calendar_entity();
    newCalendar.title = 'My Calendar';

    await this.calendarRepository.save(newCalendar);

    newUser.calendar = newCalendar;
    await this.userRepository.save(newUser);
    newCalendar.user = newUser;
    await this.calendarRepository.save(newCalendar);

    // crée le safe user lier a cette utilisateur

    const secureUser = new SecureUserEntity();
    secureUser.firstname = user.firstname;
    secureUser.lastname = user.lastname;
    secureUser.email = user.email;
    secureUser.username = user.username;
    secureUser.imageUrl = user.image;
    secureUser.user = newUser;

    await this.secureUserRepository.save(secureUser);
    newUser.secureUser = secureUser;
    await this.userRepository.save(newUser);

    const payload = { email: user.email, sub: newUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      id: newUser.id,
      email: newUser.email,
      verified: newUser.verified,
      username: newUser.username,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      image: newUser.image,
      notif_commercial: newUser.notif_commercial,
      notif_news: newUser.notif_news,
      notif_user: newUser.notif_user,
      notif_recipe: newUser.notif_recipe,
      email_recipe: newUser.email_recipe,
      email_news: newUser.email_news,
      email_commercial: newUser.email_commercial,
    };
  }

  async updateUser(
    userId: string,
    patchUserDto: PatchUserDto,
  ): Promise<user_entity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    for (const key in patchUserDto) {
      if (patchUserDto[key] !== undefined) {
        user[key] = patchUserDto[key];
      }
    }

    await this.userRepository.save(user);
    return user;
  }

  async deleteOneUser(id: string): Promise<user_entity> {
    const userToDelete = await this.userRepository.findOne({
      where: { id },
    });
    if (!userToDelete) {
      throw new NotFoundException('user not found');
    }

    // delete le safe user de l'utilisateur

    return await this.userRepository.remove(userToDelete);
  }

  async getUserTagsByUserId(user: any): Promise<string[]> {
    const myUser = await this.getOneUser(user.user.sub);

    if (!myUser) {
      throw new NotFoundException('User not found');
    }

    const tags = myUser.tags || [];
    return tags.map((tag) => tag.tag);
  }

  async addTagToUser(
    userId: string,
    addTagToUserDto: addTagToUserDto,
  ): Promise<user_entity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tags'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tag = await this.tagRepository.findOne({
      where: { tag: addTagToUserDto.tag },
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (!user.tags.some((existingTag) => existingTag.id === tag.id)) {
      user.tags.push(tag);
      await this.userRepository.save(user);
    }

    return user;
  }

  async getUserTagById(userId: string, tagId: string): Promise<tag_entity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tags'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tag = user.tags.find((tag) => tag.id.toString() === tagId);
    if (!tag) {
      throw new NotFoundException('Tag not found for this user');
    }

    return tag;
  }

  async deleteAllUsers(): Promise<user_entity[]> {
    const usersToDelete = await this.userRepository.find();
    for (const a of usersToDelete) {
      await this.userRepository.remove(a);
    }
    return usersToDelete;
  }

  async deleteUserDiet(
    user: any,
    dietsToDelete: string[],
  ): Promise<user_entity> {
    const userId = user.user.sub;

    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['diets'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    for (const title of dietsToDelete) {
      const diet = await this.dietRepository.findOne({
        where: { title },
      });

      if (diet) {
        userEntity.diets = userEntity.diets.filter(
          (dietEntity) => dietEntity.id !== diet.id,
        );
      } else {
        throw new NotFoundException(`Diet not found with title: ${title}`);
      }
    }

    await this.userRepository.save(userEntity);
    return userEntity;
  }

  async getUserDiets(user: any): Promise<diet_entity[]> {
    const myUser = await this.userRepository.findOne({
      where: { id: user.user.sub },
      relations: ['diets'],
    });

    if (!myUser) {
      throw new NotFoundException('User not found');
    }

    return myUser.diets;
  }

  async addDietToUser(user: any, dietsToAdd: string[]): Promise<user_entity> {
    const userId = user.user.sub;

    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['diets'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    userEntity.diets = [];

    for (const title of dietsToAdd) {
      const diet = await this.dietRepository
        .createQueryBuilder('diet')
        .where('LOWER(diet.title) = LOWER(:title)', { title })
        .getOne();

      if (diet) {
        userEntity.diets.push(diet);
      } else {
        throw new NotFoundException(`Diet not found with title: ${title}`);
      }
    }

    await this.userRepository.save(userEntity);
    return userEntity;
  }

  async addRecipeToUser(
    requestUser: any,
    addRecipeToUserDto: AddRecipeToUserDto,
  ): Promise<user_entity> {
    const userId = requestUser.user.sub;

    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['recipes'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const recipe = await this.recipeRepository.findOne({
      where: { title: addRecipeToUserDto.recipeName },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const recipeExists = userEntity.recipes.some(
      (existingRecipe) => existingRecipe.id === recipe.id,
    );

    if (!recipeExists) {
      userEntity.recipes.push(recipe);
      await this.userRepository.save(userEntity);
    }

    return userEntity;
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    image: string;
    fcmToken: string;
    isOauth: boolean;
    notif_user: boolean;
    notif_news: boolean;
    notif_commercial: boolean;
    notif_recipe: boolean;
    email_recipe: boolean;
    email_news: boolean;
    email_commercial: boolean;
  }> {
    const user = await this.userRepository.findOne({ where: { email } });
    const users = await this.userRepository.find({ where: { email } });

    if (user.isOauth2) {
      throw new BadRequestException(
        'This account is oauth2 connect via the right way.',
      );
    }

    if (users.length === 0) {
      throw new UnauthorizedException('User not found');
    } else if (users.length > 1) {
      throw new ConflictException('Multiple users found with the same email');
    }

    if (user?.email !== email) {
      throw new UnauthorizedException('Wrong email');
    }

    if (user && (await bcrypt.compare(password, (await user).password))) {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        fcmToken: user.fcmToken,
        isOauth: user.isOauth2,
        notif_commercial: user.notif_commercial,
        notif_news: user.notif_news,
        notif_user: user.notif_user,
        notif_recipe: user.notif_recipe,
        email_commercial: user.email_commercial,
        email_news: user.email_news,
        email_recipe: user.email_recipe,
      };
    } else {
      throw new UnauthorizedException('wrong password or email');
    }
  }

  async loginOauth(oauthDto: OauthDto): Promise<{
    access_token: string;
    id: string;
    email: string;
    verified: boolean;
    username: string;
    firstname: string;
    lastname: string;
    image: string;
    fcmToken: string;
    isOauth: boolean;
    created: boolean;
    notif_user: boolean;
    notif_news: boolean;
    notif_commercial: boolean;
    notif_recipe: boolean;
    email_recipe: boolean;
    email_news: boolean;
    email_commercial: boolean;
  }> {
    const email: string = oauthDto.email;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && !user.isOauth2) {
      throw new BadRequestException(
        'Account with this email already exisiting',
      );
    }

    if (user && user.isOauth2) {
      const payload = { email: user.email, sub: user.id };
      if (user.image === '') {
        user.image = oauthDto.image;
      }
      return {
        access_token: await this.jwtService.signAsync(payload),
        id: user.id,
        email: user.email,
        verified: user.verified,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        fcmToken: user.fcmToken,
        isOauth: user.isOauth2,
        created: false,
        notif_commercial: user.notif_commercial,
        notif_news: user.notif_news,
        notif_recipe: user.notif_recipe,
        notif_user: user.notif_user,
        email_commercial: user.email_commercial,
        email_news: user.email_news,
        email_recipe: user.email_recipe,
      };
    }

    const newUser = new user_entity();
    newUser.lastname = oauthDto.lastname;
    newUser.firstname = oauthDto.firstname;
    newUser.email = oauthDto.email;
    newUser.verified = false;
    newUser.username = oauthDto.username;
    newUser.password = '';
    newUser.teams = [];
    newUser.isOauth2 = true;
    newUser.image = oauthDto.image;
    newUser.notif_commercial = true;
    newUser.notif_news = true;
    newUser.notif_recipe = true;
    newUser.notif_user = true;
    const newCalendar = new calendar_entity();
    newCalendar.title = 'My Calendar';

    await this.calendarRepository.save(newCalendar);

    newUser.calendar = newCalendar;
    await this.userRepository.save(newUser);
    newCalendar.user = newUser;
    await this.calendarRepository.save(newCalendar);
    await this.userRepository.save(newUser);

    const payload = { email: oauthDto.email, sub: newUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      id: newUser.id,
      email: newUser.email,
      verified: newUser.verified,
      username: newUser.username,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      image: newUser.image,
      fcmToken: newUser.fcmToken,
      isOauth: newUser.isOauth2,
      created: true,
      notif_commercial: newUser.notif_commercial,
      notif_news: newUser.notif_news,
      notif_user: newUser.notif_user,
      notif_recipe: newUser.notif_recipe,
      email_commercial: newUser.email_commercial,
      email_news: newUser.email_news,
      email_recipe: newUser.email_recipe,
    };
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async getUserRecipes(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['recipes'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.recipes.map((recipe) => recipe.title);
  }

  async getUserFavoriteRecipes(
    user: any,
  ): Promise<{ id: string; title: string; image: string }[]> {
    const myUser = await this.getOneUser(user.user.sub);

    if (!myUser) {
      throw new NotFoundException('User not found');
    }

    return myUser.favoritedRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    }));
  }

  async deleteUserFavoriteRecipe(
    request: any,
    favoriteRecipeDto: FavoriteRecipeDto,
  ): Promise<user_entity> {
    const userId = request.user.sub;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritedRecipes'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recipe = await this.recipeRepository.findOne({
      where: { id: favoriteRecipeDto.recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    user.favoritedRecipes = user.favoritedRecipes.filter(
      (r) => r.id !== recipe.id,
    );
    await this.userRepository.save(user);

    return user;
  }

  async favoriteRecipeByName(
    request: any,
    favoriteRecipeDto: FavoriteRecipeDto,
  ): Promise<user_entity> {
    const userId = request.user.sub;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritedRecipes'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recipe = await this.recipeRepository.findOne({
      where: { id: favoriteRecipeDto.recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (!user.favoritedRecipes.some((r) => r.id === recipe.id)) {
      user.favoritedRecipes.push(recipe);
      await this.userRepository.save(user);
    }

    return user;
  }

  async addUserUstensiles(
    user: any,
    addUstensilesDto: AddUstensilesDto,
  ): Promise<user_entity> {
    const userId = user.user.sub;

    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ustensiles'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    userEntity.ustensiles = [];

    for (const title of addUstensilesDto.ustensileNames) {
      const ustensile = await this.ustensileRepository.findOne({
        where: { title },
      });
      if (!ustensile) {
        throw new NotFoundException(`Ustensile not found with title: ${title}`);
      }
      if (ustensile) {
        userEntity.ustensiles.push(ustensile);
      }
    }

    await this.userRepository.save(userEntity);
    return userEntity;
  }

  async getUserUstensiles(user: any): Promise<ustensile_entity[]> {
    const myUser = await this.getOneUser(user.user.sub);
    if (!myUser) {
      throw new NotFoundException('User not found');
    }

    return myUser.ustensiles;
  }

  async deleteUserUstensile(
    user: any,
    addUserUstensilesDto: AddUstensilesDto,
  ): Promise<user_entity> {
    const userId = user.user.sub;

    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ustensiles'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    for (const title of addUserUstensilesDto.ustensileNames) {
      const ustensile = await this.ustensileRepository.findOne({
        where: { title },
      });
      if (!ustensile) {
        throw new NotFoundException(`Ustensile not found with title: ${title}`);
      }
      userEntity.ustensiles = userEntity.ustensiles.filter(
        (u) => u.id !== ustensile.id,
      );
    }

    await this.userRepository.save(userEntity);
    return userEntity;
  }

  async patchUserSubscription(
    id: string,
    isSubscribed: boolean,
  ): Promise<user_entity> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    userEntity.isSubcribed = isSubscribed;

    const updatedUser = await this.userRepository.save(userEntity);

    return updatedUser;
  }
}
