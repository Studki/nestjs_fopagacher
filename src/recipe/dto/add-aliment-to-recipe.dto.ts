// add-aliments-to-recipe.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AddAlimentsToRecipeDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  alimentNames: string[];
}
