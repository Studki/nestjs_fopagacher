import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AddRecipeToUserDto {
  @ApiProperty({ description: 'name of the recipe' })
  @IsString()
  readonly recipeName: string;
}
