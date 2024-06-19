import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { user_entity } from 'src/user/entities/user.entity';
import { item_entity } from './entities/item.entity';
import { CreateItem } from './dto/create-item.dto';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { create } from 'domain';
import { list_entity } from 'src/list/entities/list.entity';
import { AdditemToFridgeDto } from './dto/add-item-to-fridge.dto';
import { AdditemToListDto } from './dto/add-item-to-list.dto';
import { RemoveitemFromFridgeDto } from './dto/remove-item-from-fridge.dto';
import { RemoveitemFromListDto } from './dto/remove-item-from-list.dto';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { event_entity } from 'src/event/entities/event.entity';
import { RecipeService } from 'src/recipe/recipe.service';
import { recipeStep_entity } from 'src/recipe/entities/recipe-details.entity';

@Injectable()
export class itemService {
  constructor(
    @InjectRepository(item_entity)
    private readonly itemRepository: Repository<item_entity>,
    @InjectRepository(aliment_entity)
    private readonly alimentRepository: Repository<aliment_entity>,
    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,
    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,
    @InjectRepository(list_entity)
    private readonly listRepository: Repository<list_entity>,
    @InjectRepository(event_entity)
    private readonly eventRepository: Repository<event_entity>,
    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,
    @InjectRepository(recipeStep_entity)
    private readonly recipeDetailsRepository: Repository<recipeStep_entity>,
  ) {}

  async createitem(
    user: any,
    createitemDto: CreateItem,
  ): Promise<item_entity[]> {
    const userId = user.user.sub;
    const items: item_entity[] = [];
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    if (createitemDto.alimentName.length !== createitemDto.quantity.length) {
      throw new BadRequestException(
        'The alimentName and quantity arrays must be of the same length.',
      );
    }

    for (let index = 0; index < createitemDto.alimentName.length; index++) {
      let found: boolean = false;
      const alimentName = createitemDto.alimentName[index];
      const quantity = createitemDto.quantity[index];
      const lowerCaseAlimentName = alimentName.toLowerCase();

      const aliment = await this.alimentRepository
        .createQueryBuilder('aliment')
        .where('LOWER(aliment.title) = :title', { title: lowerCaseAlimentName })
        .getOne();

      if (!aliment) {
        throw new BadRequestException(
          `Aliment not found with name: ${alimentName}`,
        );
      }

      if (createitemDto.fridgeId) {
        let i: number = 0;
        const fridge = await this.fridgeRepository.findOne({
          where: { id: createitemDto.fridgeId },
          relations: ['aliments', 'aliments.aliment'],
        });
        for (const al of fridge.aliments) {
          console.log(al.aliment.title);
          console.log(alimentName);
          if (al.aliment.title === alimentName) {
            console.log(found);
            al.quantity += quantity;
            items.push(al);
            found = true;
            await this.itemRepository.save(al);
            break;
          }
        }
        if (!found) {
          const itemForFridge = await this.createItemForFridgeOrList(
            createitemDto.fridgeId,
            null,
            aliment,
            quantity,
            expirationDate,
          );
          items.push(itemForFridge);
        }
        found = false;
      }

      if (createitemDto.listId) {
        let i: number = 0;
        const list = await this.listRepository.findOne({
          where: { id: createitemDto.listId },
          relations: ['aliments', 'aliments.aliment'],
        });
        for (const al of list.aliments) {
          if (al.aliment.title === alimentName) {
            al.quantity += quantity;
            items.push(al);
            found = true;
            await this.itemRepository.save(al);
            break;
          }
        }
        if (!found) {
          const itemForList = await this.createItemForFridgeOrList(
            null,
            createitemDto.listId,
            aliment,
            quantity,
            null,
          );
          items.push(itemForList);
        }
        found = false;
      }

      if (!createitemDto.fridgeId && !createitemDto.listId) {
        const standaloneItem = await this.createStandaloneItem(
          aliment,
          quantity,
        );
        items.push(standaloneItem);
      }
    }

    return items;
  }

  private async createItemForFridgeOrList(
    fridgeId: string | null,
    listId: string | null,
    aliment: aliment_entity,
    quantity: number,
    expirationDate: Date | null,
  ): Promise<item_entity> {
    const item = new item_entity();
    item.aliment = aliment;
    item.quantity = quantity;
    item.expirationDate = expirationDate;

    if (fridgeId) {
      const fridge = await this.fridgeRepository.findOne({
        where: { id: fridgeId },
      });
      if (!fridge)
        throw new BadRequestException(`Fridge not found with id: ${fridgeId}`);
      item.fridge = fridge;
    }

    if (listId) {
      const list = await this.listRepository.findOne({ where: { id: listId } });
      if (!list)
        throw new BadRequestException(`List not found with id: ${listId}`);
      item.list = list;
    }

    await this.itemRepository.save(item);
    return item;
  }

  private async createStandaloneItem(
    aliment: aliment_entity,
    quantity: number,
  ): Promise<item_entity> {
    const item = new item_entity();
    item.aliment = aliment;
    item.quantity = quantity;
    await this.itemRepository.save(item);
    return item;
  }

  async getAllItems(): Promise<item_entity[]> {
    return await this.itemRepository.find({ relations: ['aliment'] });
  }

  async checkItems(itemsId: string[], checked: boolean[]): Promise<Boolean> {
    if (itemsId.length !== checked.length) {
      throw new BadRequestException('itemsId.length != checked.length');
    }

    for (let i: number = 0; i < itemsId.length; i++) {
      const item = await this.itemRepository.findOne({
        where: { id: itemsId[i] },
      });
      if (!item) {
        throw new BadRequestException(`Item not found with id ${itemsId[i]}`);
      }
      item.isChecked = checked[i];
      await this.itemRepository.save(item);
    }
    return true;
  }

  async updateItemQuantities(itemsId: string[], quantities: number[]) {
    if (itemsId.length !== quantities.length) {
      throw new BadRequestException(
        'The itemsId and quantities arrays must be of the same length.',
      );
    }

    const items: item_entity[] = [];

    for (let index = 0; index < itemsId.length; index++) {
      const item = await this.itemRepository.findOne({
        where: { id: itemsId[index] },
      });

      if (!item) {
        throw new BadRequestException(
          `Item not found with ID ${itemsId[index]}`,
        );
      }

      item.quantity = quantities[index];
      const updatedItem = await this.itemRepository.save(item);
      items.push(updatedItem);
    }

    return items;
  }

  async additemToFridge(
    user: any,
    additemToFridge: AdditemToFridgeDto,
  ): Promise<item_entity> {
    const userId = user.user.sub;
    const item = await this.itemRepository.findOne({
      where: { id: additemToFridge.itemId },
      relations: ['aliment', 'fridge', 'list'],
    });
    const isAlreadyLinked = await this.itemRepository.findOne({
      where: { id: additemToFridge.itemId },
      relations: ['fridge'],
    });
    if (isAlreadyLinked && isAlreadyLinked.fridge) {
      throw new BadRequestException(`Aliment already linked to a fridge`);
    }
    const fridge = await this.fridgeRepository.findOne({
      where: { id: additemToFridge.fridgeId },
    });
    if (!fridge) {
      throw new BadRequestException(
        `Fridge not found with id: ${additemToFridge.fridgeId}`,
      );
    }
    item.fridge = fridge;
    let date = new Date();
    date.setDate(date.getDate() + 7);
    item.expirationDate = date;
    await this.itemRepository.save(item);
    return item;
  }

  async additemToList(
    user: any,
    additemToList: AdditemToListDto,
  ): Promise<item_entity> {
    const userId = user.user.sub;
    const item = await this.itemRepository.findOne({
      where: { id: additemToList.itemId },
      relations: ['aliment', 'fridge', 'list'],
    });
    const isAlreadyLinked = await this.itemRepository.findOne({
      where: { id: additemToList.itemId },
      relations: ['list'],
    });
    if (isAlreadyLinked && isAlreadyLinked.list) {
      throw new BadRequestException(`Aliment already linked to a list`);
    }
    const list = await this.listRepository.findOne({
      where: { id: additemToList.listId },
    });
    if (!list) {
      throw new BadRequestException(`List not found`);
    }
    item.list = list;
    await this.itemRepository.save(item);
    return item;
  }

  async removeItemsFromList(
    user: any,
    removeItemsFromListDto: RemoveitemFromListDto,
  ): Promise<item_entity[]> {
    const userId = user.user.sub;
    const itemsToRemove: item_entity[] = [];

    for (const itemId of removeItemsFromListDto.itemId) {
      const item = await this.itemRepository.findOne({
        where: { id: itemId },
        relations: ['aliment', 'fridge', 'list'],
      });

      if (!item || item.list?.id !== removeItemsFromListDto.listId) {
        throw new BadRequestException(
          `Item with ID ${itemId} is not linked to the specified list not a bag alert at all bruv -_-`,
        );
      }

      item.list = null;
      const updatedItem = await this.itemRepository.save(item);
      itemsToRemove.push(updatedItem);
    }

    return itemsToRemove;
  }

  async removeItemsFromFridge(
    user: any,
    removeItemsFromFridgeDto: RemoveitemFromFridgeDto,
  ): Promise<item_entity[]> {
    const userId = user.user.sub;
    const items: item_entity[] = [];

    for (const itemId of removeItemsFromFridgeDto.itemId) {
      const item = await this.itemRepository.findOne({
        where: { id: itemId },
        relations: ['aliment', 'fridge', 'list'],
      });

      if (!item || item.fridge?.id !== removeItemsFromFridgeDto.fridgeId) {
        throw new BadRequestException(
          `Item with ID ${itemId} is not linked to the specified fridge major bruh moment -_-`,
        );
      }

      item.fridge = null;
      const updatedItem = await this.itemRepository.save(item);
      items.push(updatedItem);
    }

    return items;
  }

  async getOneAliment(id: string): Promise<aliment_entity> {
    return await this.alimentRepository.findOne({ where: { id } });
  }

  async getItemUtilizationDate(itemID: string) {
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.itemQuantity', 'itemQuantity')
      .innerJoinAndSelect('itemQuantity.item', 'item')
      .where('item.id = :itemID', { itemID })
      .getMany();

    if (!events.length) {
      return [];
    }

    const eventsWithRecipeName = await Promise.all(events.map(async (event) => {
      const recipe = await this.recipeRepository.findOne({ where: { id: event.recipeID } });
      const recette = await this.recipeDetailsRepository.findOne({ where: { recipe: recipe } });
        return {
          date: event.date,
          recipeName: recette.title,
        };
    }));
    return eventsWithRecipeName;
  }
}
