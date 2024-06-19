import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class RecipeCompletionDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  fridgeId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  recipeId: string;
}
