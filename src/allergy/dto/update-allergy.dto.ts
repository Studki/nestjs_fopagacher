import { ApiProperty } from '@nestjs/swagger';

export class UpdateAllergyDto {
  @ApiProperty()
  title: string;
}
