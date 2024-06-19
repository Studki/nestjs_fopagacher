import { ApiProperty } from '@nestjs/swagger';

export class UpdateUstensileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;
}
