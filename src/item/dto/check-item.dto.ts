import { ApiProperty } from '@nestjs/swagger';

export class CheckItemDto {
  @ApiProperty()
  itemsId: string[];

  @ApiProperty()
  checked: boolean[];
}
