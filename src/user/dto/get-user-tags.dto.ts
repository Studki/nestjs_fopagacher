import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class GetUserTagsDto {
  @ApiProperty({ description: 'Array of user tag names or IDs' })
  @IsArray()
  @IsNotEmpty()
  tags: string[];
}
