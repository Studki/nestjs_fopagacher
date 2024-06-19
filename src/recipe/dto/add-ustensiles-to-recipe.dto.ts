import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUstensilesToRecipeDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ustensiles: string[];
}
