import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ArrayNotEmpty, IsString, IsArray } from 'class-validator';

export class RemoveitemFromFridgeDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  itemId: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fridgeId: string;
}
