import { ApiProperty } from '@nestjs/swagger';
export class CreateIssueDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  description: string;
}