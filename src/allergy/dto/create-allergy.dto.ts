import { ApiProperty } from '@nestjs/swagger';

export class CreateAllergyDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  image: string;
}
