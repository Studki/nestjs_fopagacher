import { ApiProperty } from '@nestjs/swagger';

export class AddFridgeDto {
  @ApiProperty()
  fridgeId: string;
}
