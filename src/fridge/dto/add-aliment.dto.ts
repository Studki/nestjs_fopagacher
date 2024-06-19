import { ApiProperty } from '@nestjs/swagger';

export class AlimentDto {
  @ApiProperty()
  itemId: string;
}
