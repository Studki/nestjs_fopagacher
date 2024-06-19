import { ApiProperty } from '@nestjs/swagger';
export class CreateListDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  image?: string;
}
