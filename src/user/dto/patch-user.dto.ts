import { ApiProperty } from '@nestjs/swagger';
import { tag_entity } from 'src/tag/entities/tag.entity';
export class PatchUserDto {
  @ApiProperty()
  firstname?: string;
  @ApiProperty()
  lastname?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  verified?: boolean;
  @ApiProperty()
  username?: string;
  @ApiProperty()
  image?: string;
  @ApiProperty()
  fcmToken?: string;
  @ApiProperty()
  notif_recipe?: boolean;
  @ApiProperty()
  notif_user?: boolean;
  @ApiProperty()
  notif_news?: boolean;
  @ApiProperty()
  notif_commercial?: boolean;
  @ApiProperty()
  email_user?: boolean;
  @ApiProperty()
  email_news?: boolean;
  @ApiProperty()
  email_commercial?: boolean;
}
