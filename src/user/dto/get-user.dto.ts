import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { ustensile_entity } from 'src/ustensile/entities/ustensile.entity';

export class getUser {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid firstname' })
  id: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid firstname' })
  firstname: string;
  @ApiProperty()
  @IsString({ message: 'Please enter a valid lastname' })
  @IsNotEmpty()
  lastname: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Please enter a valid email' })
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid username' })
  verified: boolean;
  @ApiProperty()
  @IsBoolean()
  username: string;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Please enter a valid tag' })
  tags: tag_entity[];
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Please enter a valid team' })
  teams: tag_entity[];
  @ApiProperty()
  @IsString()
  role?: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid imageUrl' })
  image?: string;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Please enter a valid favorite recipe' })
  favoritedRecipes: recipe_entity[];
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Please enter a valid recipe' })
  recipes: recipe_entity[];
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Please enter a valid ustensile' })
  ustensiles: ustensile_entity[];
  @ApiProperty()
  @IsString()
  fcmToken?: string;
}
