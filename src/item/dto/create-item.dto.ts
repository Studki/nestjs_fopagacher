import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isString,
} from 'class-validator';

export class CreateItem {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  alimentName: string[];
  @ApiProperty()
  @IsString()
  @IsOptional()
  fridgeId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  listId?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  recipeId?: string;
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNotEmpty()
  quantity: number[];
}
