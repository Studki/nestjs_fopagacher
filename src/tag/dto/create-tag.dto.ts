import { ApiProperty } from '@nestjs/swagger';
export class createTagDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tag: string;
}
