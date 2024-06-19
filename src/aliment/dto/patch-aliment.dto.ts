import { ApiProperty } from '@nestjs/swagger';
export class PatchAlimentDto {
  @ApiProperty()
  title?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  price?: number;
  @ApiProperty()
  image?: string;
  @ApiProperty()
  category?: string;
  @ApiProperty()
  tag?: string;
  @ApiProperty()
  unit?: string;
}
