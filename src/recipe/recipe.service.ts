import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { recipe_entity } from './entities/recipe.entity';
import { CreateRecipeDto, steps } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { AddAlimentsToRecipeDto } from './dto/add-aliment-to-recipe.dto';
import { item_entity } from 'src/item/entities/item.entity';
import axios from 'axios';
import { blob } from 'stream/consumers';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { userInfo } from 'os';
import { user_entity } from 'src/user/entities/user.entity';
import { AddUstensilesToRecipeDto } from './dto/add-ustensiles-to-recipe.dto';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';
import { recipeStep_entity } from './entities/recipe-details.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,
    @InjectRepository(aliment_entity)
    private alimentRepository: Repository<aliment_entity>,
    @InjectRepository(fridge_entity)
    private FridgeRepository: Repository<fridge_entity>,
    @InjectRepository(user_entity)
    private readonly UserRepository: Repository<user_entity>,
    @InjectRepository(item_entity)
    private itemRepository: Repository<item_entity>,
    @InjectRepository(ustensile_entity)
    private ustensileRepository: Repository<ustensile_entity>,
    @InjectRepository(recipeStep_entity)
    private readonly recipeStepRepository: Repository<recipeStep_entity>,
  ) {}

  async findOne(
    id: string,
    user: any,
  ): Promise<{
    id: string;
    title: string;
    favorited: boolean;
    recipeOfTheDay: boolean;
    aliments: item_entity[];
    steps: recipeStep_entity[];
    ustensiles: ustensile_entity[];
    image: string;
    totalTime: number;
  }> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: [
        'favoritedByUsers',
        'aliments',
        'recette',
        'ustensiles',
        'aliments.aliment',
      ],
    });

    if (!recipe) {
      return null;
    }

    const userId: string = user.user.sub;

    let favorited: boolean = false;

    if (recipe.favoritedByUsers && recipe.favoritedByUsers.length > 0) {
      for (const user of recipe.favoritedByUsers) {
        if (user.id === userId) {
          favorited = true;
          break;
        }
      }
    }

    return {
      id: recipe.id,
      title: recipe.title,
      favorited: favorited,
      recipeOfTheDay: recipe.recipeOfTheDay,
      aliments: recipe.aliments,
      steps: recipe.recette,
      ustensiles: recipe.ustensiles,
      image: recipe.image,
      totalTime: recipe.totalTime,
    };
  }

  async findAll() {
    return this.recipeRepository
      .createQueryBuilder('recipe')
      .select([
        'recipe.id',
        'recipe.title',
        'recipe.recipeOfTheDay',
        'recipe.image',
      ])
      .getMany();
  }

  async addDetailsToSeededRecipes(steps: steps[], newRecipe: recipe_entity) {
    if (!newRecipe) {
      throw new NotFoundException(
        'recipe passed as argv of addDetailsToSeededRecipes doesnt exist',
      );
    }
    newRecipe.recette = [];
    for (const step of steps) {
      const newStep = new recipeStep_entity();
      newStep.title = step.title;
      newStep.description = step.description;
      newStep.recipe = newRecipe;
      this.recipeStepRepository.save(newStep);
      newRecipe.recette.push(newStep);
    }

    this.recipeRepository.save(newRecipe);
  }

  async findAllDetails() {
    return this.recipeRepository.find({
      relations: [
        'recette',
        'aliments',
        'ustensiles',
        'aliments.aliment',
        'favoritedByUsers',
      ],
    });
  }

  async addUstensileToSeededRecipes(
    ustensilesNames: string[],
    newRecipe: recipe_entity,
  ) {
    if (!newRecipe) {
      throw new NotFoundException(
        'recipe passed as arg to addUstensileToSeededRecipes not found',
      );
    }
    for (const ustensileName of ustensilesNames) {
      const ustensile = await this.ustensileRepository.findOne({
        where: { title: ustensileName },
      });

      newRecipe.ustensiles.push(ustensile);
    }

    await this.recipeRepository.save(newRecipe);
  }

  async recipeCompletionService(fridgeId: string, recipeId: string) {
    const fridge = await this.FridgeRepository.findOne({
      where: { id: fridgeId },
      relations: ['aliments', 'aliments.aliment'],
    });
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      relations: ['aliments', 'aliments.aliment'],
    });

    if (!fridge || !recipe) {
      throw new NotFoundException('Recipe or fridge provided not found');
    }

    console.log('=========');
    recipe.aliments.forEach((aliment) => {
      console.log('recipe aliment : ' + aliment.aliment.title);
    });
    fridge.aliments.forEach((aliment) => {
      console.log('fridge aliment : ' + aliment.aliment.title);
    });

    if (fridge.aliments.length < recipe.aliments.length) {
      throw new BadRequestException(
        'Fridge provided does not have the required aliments',
      );
    }

    let counter: number = 0;
    for (const recipeAliment of recipe.aliments) {
      const index = fridge.aliments.findIndex(
        (fridgeAliment) =>
          fridgeAliment.aliment.id === recipeAliment.aliment.id,
      );

      if (index > -1) {
        fridge.aliments.splice(index, 1);
        counter++;
      } else {
        throw new NotFoundException(
          'Not all the aliment in the given recipe are in the given fridge',
        );
      }
    }

    if (counter !== recipe.aliments.length) {
      console.log('counter : ' + counter);
      throw new NotFoundException(
        'Not all the aliment in the given recipe are in the given fridge',
      );
    }

    await this.FridgeRepository.save(fridge);
    return fridge;
  }

  //not to be used outside seeder
  async addAlimentToSeededRecipes(
    alimentsNames: string[],
    quantities: number[],
    newRecipe: recipe_entity,
  ) {
    if (alimentsNames.length !== quantities.length) {
      throw new BadRequestException(
        'to add aliment to a seeded recipe you need to add the same number of aliment name and aliment quantities',
      );
    }
    const items: item_entity[] = [];
    for (let i: number = 0; i < alimentsNames.length; i++) {
      const alimentName: string = alimentsNames[i].toLowerCase();
      const quantity: number = quantities[i];

      const aliment: aliment_entity = await this.alimentRepository
        .createQueryBuilder('aliment')
        .where('LOWER(aliment.title) = :title', { title: alimentName })
        .getOne();
      if (aliment) {
        const item: item_entity = new item_entity();
        item.aliment = aliment;
        item.quantity = quantity;
        item.recipe = newRecipe;
        items.push(item);
      } else {
        throw new BadRequestException(
          'Aliment not found with name : ' + alimentName,
        );
      }
    }
    await this.recipeRepository.save(newRecipe);
    for (const item of items) {
      await this.itemRepository.save(item);
    }
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<recipe_entity> {
    if (
      createRecipeDto.alimentNames.length !== createRecipeDto.quantity.length
    ) {
      throw new BadRequestException(
        'There must be the same number of aliment names and quantities.',
      );
    }

    const newRecipe = this.recipeRepository.create({
      title: createRecipeDto.recipe,
      recipeOfTheDay: createRecipeDto.recipeOfTheDay,
      totalTime: 0,
    });
    const savedRecipe = await this.recipeRepository.save(newRecipe);

    const recipeSteps = createRecipeDto.recette.map((step) => {
      newRecipe.totalTime += step.time;
      const newStep = this.recipeStepRepository.create({
        title: step.title,
        description: step.description,
        time: step.time,
        recipe: savedRecipe,
      });
      return this.recipeStepRepository.save(newStep);
    });

    await Promise.all(recipeSteps);

    const items: item_entity[] = [];

    for (let i = 0; i < createRecipeDto.alimentNames.length; i++) {
      const alimentName = createRecipeDto.alimentNames[i].toLowerCase();
      const quantity = createRecipeDto.quantity[i];

      let aliment = await this.alimentRepository
        .createQueryBuilder('aliment')
        .where('LOWER(aliment.title) = :title', { title: alimentName })
        .getOne();

      if (!aliment) {
        aliment = new aliment_entity();
        aliment.title = alimentName;
        aliment.description = '';
        aliment.price = 0;
        aliment.image = '';
        aliment.category = '';
        aliment.tag = '';
        aliment.unit = '';
        await this.alimentRepository.save(aliment);
      }

      const item = this.itemRepository.create({
        aliment,
        quantity,
        recipe: savedRecipe,
      });
      items.push(item);
    }

    await this.itemRepository.save(items);

    return savedRecipe;
  }

  async addUstensilesToRecipe(
    recipeId: string,
    addUstensilesToRecipeDto: AddUstensilesToRecipeDto,
  ) {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      relations: ['ustensiles'],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe not found with ID: ${recipeId}`);
    }

    for (const ustensileName of addUstensilesToRecipeDto.ustensiles) {
      const ustensile = await this.ustensileRepository.findOne({
        where: { title: ustensileName },
      });

      recipe.ustensiles.push(ustensile);
    }

    await this.recipeRepository.save(recipe);

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    const recipeToUpdate = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipeToUpdate) {
      return null;
    }
    const updatedRecipe = { ...recipeToUpdate, ...updateRecipeDto };
    return this.recipeRepository.save(updatedRecipe);
  }

  async remove(id: string) {
    const recipeToRemove = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipeToRemove) {
      return null;
    }
    return this.recipeRepository.remove(recipeToRemove);
  }

  async callAI(request: any, fridgeId: string, tps: number) {
    const myUser = request.user.sub;
    console.log(myUser);
    const url = `http://ai.patzenhoffer.eu/recipe/create_recipe/`;

    try {
      const formData = new FormData();
      formData.append('user', myUser);
      const fridge = await this.FridgeRepository.findOne({
        where: { id: fridgeId },
        relations: ['aliments', 'aliments.aliment'],
      });
      if (!fridge) {
        throw new NotFoundException(`Fridge not found with ID: ${fridgeId}`);
      }

      const jsonString =
        '[' +
        fridge.aliments
          .map(
            (aliment) =>
              '{"id":"' +
              aliment.id +
              '","title":"' +
              aliment.aliment.title +
              '","tags":"' +
              aliment.aliment.tag +
              '","quantity":' +
              aliment.quantity +
              ',"expirationDate":"' +
              aliment.expirationDate +
              '"}',
          )
          .join(', ') +
        ']';

      console.log(jsonString);
      formData.append('aliments', jsonString);
      const user_entity = await this.UserRepository.findOne({
        where: { id: myUser },
        relations: ['tags', 'ustensiles'],
      });
      console.log(user_entity);
      if (!user_entity) {
        throw new NotFoundException(`User not found with ID: ${myUser}`);
      }
      const ustensilesString =
        '[' +
        user_entity.ustensiles
          .map((ustensile) => '{"title" :"' + ustensile.title + '"}')
          .join(', ') +
        ']';
      formData.append('ustensiles', ustensilesString);
      const usertags =
        '[' + user_entity.tags.map((tag) => tag).join(', ') + ']';
      formData.append('tags', usertags);
      formData.append('tps', tps.toString());
      console.log(formData);
      const response = await axios.post(url, formData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
