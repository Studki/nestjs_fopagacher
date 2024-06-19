import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class DeleteUserAllergy {
  @ApiProperty()
  @IsString({ each: true })
  allergiesToDelete: string[];
}
