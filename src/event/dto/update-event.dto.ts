import { ApiProperty } from '@nestjs/swagger';
export class UpdateDateDto {
  @ApiProperty()
  date?: Date;

  @ApiProperty()
  title?: string;
}
