import { ApiProperty } from '@nestjs/swagger';
;
export class NotificationUserDto {
  @ApiProperty()
  notif_recipe: boolean;

  @ApiProperty()
  notif_user: boolean;

  @ApiProperty()
  notif_news: boolean;

  @ApiProperty()
  notif_commercial: boolean;

}
