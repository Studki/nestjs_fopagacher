import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class DeleteUserDiet {
  @ApiProperty()
  @IsString({ each: true })
  dietsToDelete: string[];
}
