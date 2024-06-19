import { ApiProperty } from '@nestjs/swagger';
import { steps } from './create-recipe.dto';

export class UpdateRecipeDto {
  @ApiProperty()
  recipe?: string;

  @ApiProperty()
  recette?: steps[];

  @ApiProperty()
  recipeOfTheDay?: boolean;

  @ApiProperty()
  image?: string;
}
