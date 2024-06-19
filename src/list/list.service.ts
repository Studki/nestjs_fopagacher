import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { list_entity } from './entities/list.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { user_entity } from 'src/user/entities/user.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { ItemQuantity } from 'src/event/entities/itemQuantity_entity.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { FridgeService } from 'src/fridge/fridge.service';
import { AlimentDto } from 'src/fridge/dto';
import { RemoveitemFromListDto } from 'src/item/dto/remove-item-from-list.dto';
import { itemService } from 'src/item/item.service';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(list_entity)
    private readonly listRepository: Repository<list_entity>,
    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,
    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,
    @InjectRepository(ItemQuantity)
    private readonly itemQuantityRepository: Repository<ItemQuantity>,
    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,
    @InjectRepository(item_entity)
    private readonly itemRepository: Repository<item_entity>,
    private readonly fridgeService: FridgeService,
    private readonly itemService: itemService,
  ) {}

  async findOne(user: any, id: string) {
    const userId = user.user.sub;
    const myUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['lists', 'lists.aliments', 'lists.aliments.aliment'],
    });
    if (!myUser) {
      throw new BadRequestException('User not found');
    }
    const list = myUser.lists.find((list) => list.id === id);
    if (!list) {
      throw new BadRequestException('List not found');
    }
    return list;
  }

  async getImages(): Promise<string[]> {
    const uuids: string[] = [
      '7d444840-9dc0-11d1-b245-5ffdce74fad2',
      '16fd2706-8baf-433b-82eb-8c7fada847da',
      'b4e7b020-857c-11e9-8f9e-2a86e4085a59',
    ];
    return uuids;
  }

  async findAll(user: any) {
    const userId = user.user.sub;
    const myUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['lists', 'lists.aliments'],
    });
    if (!myUser) {
      throw new BadRequestException('User not found');
    }
    return myUser.lists;
  }

  async create(user: any, createListDto: CreateListDto) {
    const userId = user.user.sub;
    const myUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['lists'],
    });
    if (!myUser) {
      throw new BadRequestException('User not found');
    }
    const list = new list_entity();
    list.title = createListDto.title;
    list.description = createListDto.description;
    // list.image = createListDto.image;
    list.users = [myUser];
    if (createListDto.image) {
      list.image = createListDto.image;
    }
    return this.listRepository.save(list);
  }

  async update(id: string, updateListDto: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOne({ where: { id } });
    if (!listToUpdate) {
      return null;
    }
    const updatedList = { ...listToUpdate, ...updateListDto };
    return this.listRepository.save(updatedList);
  }

  async remove(id: string) {
    const listToRemove = await this.listRepository.findOne({ where: { id } });
    if (!listToRemove) {
      return null;
    }
    return this.listRepository.remove(listToRemove);
  }

  async sendToFridge(user: any, id: string) {
    const userId = user.user.sub;
    const myUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['lists', 'lists.aliments', 'lists.aliments.aliment'],
    });
    if (!myUser) {
      throw new BadRequestException('User not found');
    }
    const list = myUser.lists.find((list) => list.id === id);
    if (!list) {
      throw new BadRequestException('List not found');
    }
    if (!list) {
      return null;
    }
    const fridge = await this.fridgeRepository.findOne({
      where: { id: list.fridgeId },
      relations: ['aliments'],
    });
    if (!fridge) {
      return null;
    }
    for (const aliment of list.aliments) {
      await this.verifyList(aliment, fridge, list, user);
    }
    await this.fridgeRepository.save(fridge);
    return this.listRepository.save(list);
  }

  async verifyList(
    aliment: item_entity,
    fridge: fridge_entity,
    list: list_entity,
    user: any,
  ) {
    if (aliment.isChecked) {
      const item_fridge: item_entity[] = [];
      for (const f of fridge.aliments) {
        item_fridge.push(
          await this.itemRepository.findOne({
            where: { id: f.id },
            relations: ['aliment'],
          }),
        );
      }
      if (item_fridge.find((a) => a.aliment.id === aliment.aliment.id)) {
        console.log('fridge has the item');
        const fridgeAliment = item_fridge.find(
          (a) => a.aliment.id === aliment.aliment.id,
        );
        this.itemRepository.update(fridgeAliment.id, {
          quantity: fridgeAliment.quantity + aliment.quantity,
        });
        this.itemRepository.delete(aliment.id);
        /*const itemQuantity = await this.itemQuantityRepository.findOne({ where: { item: aliment.aliment, fridgeId: fridge.id } });
        const itemQuantity_list = await this.itemQuantityRepository.findOne({ where: { item: aliment.aliment, listId: list.id } });
        if (!itemQuantity) {
          return null;
        } else {
          const recipe = await this.recipeRepository.findOne({ where: { id: itemQuantity.event.recipeID } });
          if (!recipe) {
            return null;
          } 
          itemQuantity.quantity = fridgeAliment.quantity;
          const recipe_aliment = recipe.aliments.find((a) => a.id === aliment.aliment.id);
          if (recipe_aliment.quantity > fridgeAliment.quantity && itemQuantity.quantity < fridgeAliment.quantity) {
            itemQuantity.quantity = fridgeAliment.quantity;
            this.itemQuantityRepository.save(itemQuantity);
            this.itemQuantityRepository.delete(itemQuantity_list);         
          } else if (recipe_aliment.quantity > fridgeAliment.quantity) {
            itemQuantity_list.quantity = recipe_aliment.quantity - fridgeAliment.quantity;
          }
        }*/
      } else {
        console.log('not in the fridge');
        //const Aliment = new AlimentDto();
        //const Remove = new RemoveitemFromListDto();
        //Remove.itemId= [aliment.id];
        //Remove.listId = list.id;
        //Aliment.itemId = aliment.aliment.id;
        fridge.aliments.push(aliment);
        list.aliments = list.aliments.filter((a) => a.id !== aliment.id);
        //const test_1 = await this.fridgeService.addAliment(fridge.id, Aliment);
      }
    }
    await this.fridgeRepository.save(fridge);
    return this.listRepository.save(list);
  }
}
