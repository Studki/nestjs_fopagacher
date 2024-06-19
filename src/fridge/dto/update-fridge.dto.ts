import { ApiProperty } from '@nestjs/swagger';
export class UpdateFridgeDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  image?: string;
}
