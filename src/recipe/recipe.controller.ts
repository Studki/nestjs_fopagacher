import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AddAlimentsToRecipeDto } from './dto/add-aliment-to-recipe.dto';
import { Public } from 'src/shared/public.decorator';
import { AddUstensilesToRecipeDto } from './dto/add-ustensiles-to-recipe.dto';
import { DateService } from 'src/event/event.service';
import { RecipeCompletionDto } from './dto/recipe-finished.dto';

// controller for the recipe entity
@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly dateService: DateService,
  ) {}

  // CRUD operations for the recipe entity
  @Get(':id')
  @ApiOperation({ summary: 'Find a recipe by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the recipe.' })
  @ApiResponse({ status: 404, description: 'recipe not found.' })
  async findOne(@Param('id') id: string, @Req() request: Request) {
    try {
      const recipe = await this.recipeService.findOne(id, request);
      if (!recipe) {
        throw new NotFoundException('recipe not found');
      }
      return recipe;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Find all recipes' })
  @ApiResponse({ status: 200, description: 'JSON array of all recipes.' })
  @ApiResponse({ status: 404, description: 'No recipes found.' })
  async findAll() {
    try {
      return await this.recipeService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get('/details/ia')
  @ApiOperation({ summary: 'Find all recipes' })
  @ApiResponse({ status: 200, description: 'JSON array of all recipes.' })
  @ApiResponse({ status: 404, description: 'No recipes found.' })
  async findAllDetails() {
    try {
      return await this.recipeService.findAllDetails();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a recipe' })
  @ApiResponse({ status: 201, description: 'json of the new recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    try {
      return this.recipeService.create(createRecipeDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('recipeCompletion')
  @ApiOperation({
    summary: 'Remove the ingredient of given recipe from given fridge',
  })
  @ApiResponse({ status: 201, description: 'completion of the request' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async removeAlimentFromFridgeUponCompletionOfGivenRecipe(
    @Body() recipeCompletionDto: RecipeCompletionDto,
  ) {
    const result = await this.recipeService.recipeCompletionService(
      recipeCompletionDto.fridgeId,
      recipeCompletionDto.recipeId,
    );
    if (!result) {
      throw new BadRequestException('error while remove aliments');
    }
    return { message: 'Fridge has been updated' };
  }

  @Post(':id/ustensiles')
  @ApiOperation({ summary: 'Add ustensiles to a recipe' })
  @ApiResponse({ status: 201, description: 'json of the new recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addUstensiles(
    @Param('id') id: string,
    @Body() addUstensilesToRecipeDto: AddUstensilesToRecipeDto,
  ) {
    try {
      return this.recipeService.addUstensilesToRecipe(
        id,
        addUstensilesToRecipeDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiResponse({ status: 200, description: 'json of the updated recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    try {
      const recipe = await this.recipeService.update(id, updateRecipeDto);
      if (!recipe) {
        throw new NotFoundException('recipe not found');
      }
      return recipe;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiResponse({ status: 200, description: 'json of the deleted recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async remove(@Param('id') id: string) {
    try {
      const recipe = await this.recipeService.remove(id);
      if (!recipe) {
        throw new NotFoundException('recipe not found');
      }
      return recipe;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('ia/call')
  @ApiOperation({ summary: 'call the ai to get a recipe' })
  @ApiResponse({ status: 200, description: 'json of the recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async callIA(@Req() request: Request, @Body('id') id: string) {
    return this.recipeService.callAI(request, id, 0);
  }

  @Post('ia/call/week')
  @ApiOperation({ summary: 'call the ai to get a recipe' })
  @ApiResponse({ status: 200, description: 'json of the recipe' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async callIAweek(@Req() request: Request, @Body('id') id: string) {
    try {
      const recipes = await this.recipeService.callAI(request, id, 1);
      let i = 0;
      if (!recipes) {
        return null;
      }
      return await Promise.all(
        await this.dateService.feelCalendar(recipes, request))
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
