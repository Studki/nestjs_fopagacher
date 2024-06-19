import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export interface steps {
  title: string;
  description: string;
  time: number;
}

export class CreateRecipeDto {
  @ApiProperty({
    example: 'Spaghetti Carbonara',
    description: 'The name of the recipe',
  })
  recipe: string;

  @ApiProperty({
    type: [Object],
    example: [{ title: 'Step 1', description: 'Description of step 1' }],
    description: 'The steps involved in making the recipe',
  })
  recette: steps[];

  @ApiProperty({
    example: true,
    description: 'Indicates whether the recipe is the recipe of the day',
  })
  recipeOfTheDay: boolean;

  @ApiProperty({
    type: [String],
    example: ['pasta', 'bacon'],
    description: 'Names of the ingredients',
  })
  alimentNames: string[];

  @ApiProperty({
    type: [Number],
    example: [200, 100],
    description: 'Quantities of each ingredient',
  })
  quantity: number[];
}
