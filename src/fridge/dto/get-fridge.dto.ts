import { ApiProperty } from '@nestjs/swagger';
import { item_entity } from 'src/item/entities/item.entity';

export interface FridgeDetailsDTO {
  id: string;
  title: string;
  description: string;
  foods: item_entity[];
}

export interface FoodDTO {
  id: string;
  image: string;
  name: string;
  quantity: number;
}
