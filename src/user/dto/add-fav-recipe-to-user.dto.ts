import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FavoriteRecipeDto {
  @ApiProperty()
  @IsString()
  readonly recipeId: string;
}
