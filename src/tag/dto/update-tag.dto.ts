import { ApiProperty } from '@nestjs/swagger';
export class updateTagDto {
  @ApiProperty()
  tag: string;
}
