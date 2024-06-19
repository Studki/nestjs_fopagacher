import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RemoveitemFromListDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  itemId: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  listId: string;
}
