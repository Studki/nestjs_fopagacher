import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { recipe_entity } from './entities/recipe.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('RecipeController', () => {
  let recipeController: RecipeController;
  let recipeService: RecipeService;
  let recipeRepository: Repository<recipe_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        RecipeService,
        { provide: getRepositoryToken(recipe_entity), useClass: Repository },
      ],
    }).compile();

    recipeController = module.get<RecipeController>(RecipeController);
    recipeService = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get<Repository<recipe_entity>>(
      getRepositoryToken(recipe_entity),
    );
  });

  describe('findOne', () => {
    it('should return a recipe', async () => {
      const mockRecipe: recipe_entity = { id: 1, recipe: 'recipe 1' };
      jest
        .spyOn(recipeService, 'findOne')
        .mockImplementation(() => Promise.resolve(mockRecipe));

      const result = await recipeController.findOne(1);

      expect(result).toEqual(mockRecipe);
      expect(recipeService.findOne).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the recipe does not exist', async () => {
      jest
        .spyOn(recipeService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(recipeController.findOne(1)).rejects.toThrow();
      expect(recipeService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of dates', async () => {
      const mockRecipes = [
        { id: 1, recipe: 'recipe 1' },
        { id: 2, recipe: 'recipe 2' },
      ];
      jest
        .spyOn(recipeService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockRecipes));

      const result = await recipeController.findAll();

      expect(result).toEqual(mockRecipes);
      expect(recipeService.findAll).toHaveBeenCalled();
    });
    it('should return an empty array if there are no dates', async () => {
      const mockRecipes = [];
      jest
        .spyOn(recipeService, 'findAll')
        .mockImplementation(() => Promise.resolve(mockRecipes));

      const result = await recipeController.findAll();

      expect(result).toEqual(mockRecipes);
      expect(recipeService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new recipe', async () => {
      const createRecipeDto: CreateRecipeDto = { id: 4, recipe: 'New recipe' };
      const createdRecipe = { id: 1, ...createRecipeDto };
      jest
        .spyOn(recipeService, 'create')
        .mockImplementation(() => Promise.resolve(createdRecipe));

      const result = await recipeController.create(createRecipeDto);

      expect(result).toEqual(createdRecipe);
      expect(recipeService.create).toHaveBeenCalledWith(createRecipeDto);
    });
    it('should throw an error if the recipe already exists', async () => {
      const createRecipeDto: CreateRecipeDto = { id: 4, recipe: 'New recipe' };
      jest
        .spyOn(recipeService, 'create')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(recipeController.create(createRecipeDto)).rejects.toThrow();
      expect(recipeService.create).toHaveBeenCalledWith(createRecipeDto);
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      const updateRecipeDto: UpdateRecipeDto = { recipe: 'Updated recipe' };
      const updatedRecipe = { id: 1, ...updateRecipeDto };
      jest
        .spyOn(recipeService, 'update')
        .mockImplementation(() => Promise.resolve(updatedRecipe));

      const result = await recipeController.update(1, updateRecipeDto);

      expect(result).toEqual(updatedRecipe);
      expect(recipeService.update).toHaveBeenCalledWith(1, updateRecipeDto);
    });
    it('should throw an error if the recipe does not exist', async () => {
      const updateRecipeDto: UpdateRecipeDto = { recipe: 'Updated recipe' };
      jest
        .spyOn(recipeService, 'update')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(
        recipeController.update(1, updateRecipeDto),
      ).rejects.toThrow();
      expect(recipeService.update).toHaveBeenCalledWith(1, updateRecipeDto);
    });
  });

  describe('remove', () => {
    it('should remove a recipe', async () => {
      const mockRecipe: recipe_entity = { id: 1, recipe: '2023-05-18' };
      jest
        .spyOn(recipeService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(mockRecipe));

      const result = await recipeController.remove(1);

      expect(result).toEqual(mockRecipe);
      expect(recipeService.remove).toHaveBeenCalledWith(1);
    });
    it('should throw an error if the recipe does not exist', async () => {
      jest
        .spyOn(recipeService, 'remove')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      await expect(recipeController.remove(1)).rejects.toThrow();
      expect(recipeService.remove).toHaveBeenCalledWith(1);
    });
  });
});
