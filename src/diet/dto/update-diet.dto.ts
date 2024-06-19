import { ApiProperty } from '@nestjs/swagger';

export class UpdateDietDto {
  @ApiProperty()
  name: string;
}
