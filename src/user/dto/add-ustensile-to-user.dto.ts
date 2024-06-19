// add-ustensiles.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AddUstensilesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  ustensileNames: string[];
}
