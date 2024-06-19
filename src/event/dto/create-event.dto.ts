import { ApiProperty } from '@nestjs/swagger';
export class CreateEventDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  recipeID?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  alimentID?: string;

  @ApiProperty()
  listId?: string; // a mettre en optionnel

  @ApiProperty()
  fridgeId?: string;

  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  iaGenerated?: boolean;
}
