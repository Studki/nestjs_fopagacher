import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class addTagToUserDto {
  @ApiProperty()
  @IsString()
  readonly tag: string;
}
