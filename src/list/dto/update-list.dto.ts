import { ApiProperty } from '@nestjs/swagger';
export class UpdateListDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  fridgeId?: string;
}
