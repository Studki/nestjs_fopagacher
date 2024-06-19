import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto {
  @ApiProperty()
  itemsId?: string[];

  @ApiProperty()
  quantities?: number[];
}
