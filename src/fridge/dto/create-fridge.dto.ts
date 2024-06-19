import { ApiProperty } from '@nestjs/swagger';
export class CreateFridgeDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  image?: string;
}
