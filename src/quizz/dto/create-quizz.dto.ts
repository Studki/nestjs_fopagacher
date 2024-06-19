import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizzDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  choices: string[];
}
