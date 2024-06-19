import { ApiProperty } from '@nestjs/swagger';
export class PatchTeamDto {
  @ApiProperty()
  title?: string;
  @ApiProperty()
  tag?: string;
  @ApiProperty()
  description?: string;
}
