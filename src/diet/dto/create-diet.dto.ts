import { ApiProperty } from '@nestjs/swagger';

export class CreateDietDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  image: string;
}
