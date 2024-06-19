import { ApiProperty } from '@nestjs/swagger';
import { image_entity } from 'src/image/entity/image-file.entity';

export class UploadImageDto {
  @ApiProperty()
  image: Buffer;
}
