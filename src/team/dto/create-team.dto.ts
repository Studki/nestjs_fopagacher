import { ApiProperty } from '@nestjs/swagger';
export class createTeam {
  @ApiProperty()
  title: string;
  @ApiProperty()
  tag: string;
  @ApiProperty()
  description: string;
}
