import { ApiProperty } from '@nestjs/swagger';
export class UpdateQuizzDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  choices?: string[];
}
