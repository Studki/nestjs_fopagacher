import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class PatchUserAllergy {
  @ApiProperty()
  @IsString({ each: true })
  allergiesToAdd: string[];
}
