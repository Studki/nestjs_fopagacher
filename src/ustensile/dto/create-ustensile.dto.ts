import { ApiProperty } from '@nestjs/swagger';

export class CreateUstensileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  image: string;
}
