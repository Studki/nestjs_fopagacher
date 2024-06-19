import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { event_entity } from './entities/event.entity';
import { ItemQuantity } from './entities/itemQuantity_entity.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDateDto } from './dto/update-event.dto';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { list_entity } from 'src/list/entities/list.entity';

@Injectable()
export class DateService {
  constructor(
    @InjectRepository(event_entity)
    private readonly dateRepository: Repository<event_entity>,
    @InjectRepository(calendar_entity)
    private readonly calendarRepository: Repository<calendar_entity>,
    @InjectRepository(recipe_entity)
    private readonly recipeRepository: Repository<recipe_entity>,
    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,
    @InjectRepository(item_entity)
    private readonly itemRepository: Repository<item_entity>,
    @InjectRepository(aliment_entity)
    private readonly alimentRepository: Repository<aliment_entity>,
    @InjectRepository(ItemQuantity)
    private readonly itemQuantityRepository: Repository<ItemQuantity>,
    @InjectRepository(list_entity)
    private readonly listRepository: Repository<list_entity>,
  ) {}

  async findOne(id: string, request: any) {
    const date = await this.dateRepository.findOne({
      where: { id },
      relations: ['itemQuantity'],
    });
    return date;
  }

  async finditemQuantity(id: string) {
    const itemQuantity = await this.itemQuantityRepository.find({
      relations: ['item', 'event'],
      where: { event: { id } },
    });
    return itemQuantity;
  }

  async findCurrent() {
    const currentDateUTC = new Date().toUTCString();
    return currentDateUTC;
  }

  private async findAll(id: string) {
    return this.dateRepository.find({ where: { calendar: { id: id } } });
  }

  async create(createDateDto: CreateEventDto, req: any) {
    try {
      const currentDate = new Date().toUTCString();
      const date1 = new Date(currentDate);
      const date2 = new Date(createDateDto.date);
      if (date1 > date2) {
        throw new BadRequestException('Date must be in the future');
      }
      if (createDateDto.recipeID && createDateDto.alimentID) {
        throw new BadRequestException(
          'You can only add a recipe or an aliment',
        );
      }
      const date = new Date(createDateDto.date);
      const calendar = await this.calendarRepository.findOne({
        where: { user: { id: req.user.sub } },
      });

      const newDate = new event_entity();
      newDate.date = date;
      newDate.title = createDateDto.title;
      if (createDateDto.recipeID) {
        newDate.recipeID = createDateDto.recipeID;
      } else {
        newDate.alimentID = createDateDto.alimentID;
        newDate.quantity = createDateDto.quantity;
      }
      if (createDateDto.iaGenerated) {
        newDate.iaGenerated = createDateDto.iaGenerated;
      }
      const recipeID = {
        where: { id: createDateDto.recipeID },
        relations: ['aliments'],
      };
      if (!recipeID) {
        throw new BadRequestException('RecipeID not found');
      }
      const recipe = await this.recipeRepository.findOne(recipeID);
      if (!recipe) {
        throw new BadRequestException('Recipe not found');
      }
      const items: ItemQuantity[] = [];
      const ingredients = recipe.aliments;
      const list = await this.listRepository.findOne({
        where: { id: createDateDto.listId },
        relations: ['aliments', 'aliments.aliment'],
      });
      if (!list) {
        throw new BadRequestException('List not found');
      }
      const fridge = await this.fridgeRepository.findOne({
        where: { id: createDateDto.fridgeId },
        relations: ['aliments'],
      });
      if (!fridge) {
        throw new BadRequestException('Fridge not found');
      }
      const item_fridge: item_entity[] = [];
      for (const f of fridge.aliments) {
        item_fridge.push(
          await this.itemRepository.findOne({
            where: { id: f.id },
            relations: ['aliment'],
          }),
        );
        if (!item_fridge) {
          console.log('Item not found');
        }
      }
      const item_list: item_entity[] = [];
      for (const l of list.aliments) {
        item_list.push(
          await this.itemRepository.findOne({
            where: { id: l.id },
            relations: ['aliment'],
          }),
        );
        if (!item_list) {
          console.log('Item not found');
        }
      }
      for (const ingredient of ingredients) {
        const item = await this.itemRepository.findOne({
          where: { id: ingredient.id },
          relations: ['aliment'],
        });
        if (!item) {
          console.log('Item not found');
        }
        if (item_fridge.find((a) => a.aliment.id === item.aliment.id)) {
          console.log('Item found in fridge');
          const newItemQuantity: ItemQuantity = new ItemQuantity();
          newItemQuantity.item = item;
          newItemQuantity.fridgeId = createDateDto.fridgeId;
          newItemQuantity.quantity = recipe.aliments.find(
            (a) => a.id === item.id,
          ).quantity;
          const UsedQuantity = await this.findAllQuantityUsedByRecipes(item);
          const quantity = item.quantity - UsedQuantity;
          if (quantity < newItemQuantity.quantity) {
            if (item_list.find((a) => a.aliment.id === item.aliment.id)) {
              let itemlist = list.aliments.find(
                (a) => a.aliment.id === item.aliment.id,
              );
              itemlist.quantity = itemlist.quantity + newItemQuantity.quantity;
              this.itemRepository.update(itemlist.id, {
                quantity: itemlist.quantity,
              });
            } else {
              const item_list: item_entity = new item_entity();
              item_list.aliment = item.aliment;
              item_list.quantity = newItemQuantity.quantity;
              item_list.isChecked = false;
              await this.itemRepository.save(item_list);
              list.aliments.push(item_list);
              await this.listRepository.save(list);
            }
          }
          newItemQuantity.event = newDate;
          items.push(newItemQuantity);
        } else {
          console.log('Item not found in fridge');
          if (item_list.find((a) => a.aliment.id === item.aliment.id)) {
            console.log('Item found in list');
            let itemlist = list.aliments.find(
              (a) => a.aliment.id === item.aliment.id,
            );
            itemlist.quantity = itemlist.quantity + item.quantity;
            this.itemRepository.update(itemlist.id, {
              quantity: itemlist.quantity,
            });
          } else {
            console.log('Item not found in list');
            const item_list: item_entity = new item_entity();
            const newItemQuantity: ItemQuantity = new ItemQuantity();
            item_list.aliment = item.aliment;
            item_list.quantity = item.quantity;
            item_list.isChecked = false;
            await this.itemRepository.save(item_list);
            list.aliments.push(item_list);
            newItemQuantity.item = item;
            newItemQuantity.listId = createDateDto.listId;
            newItemQuantity.quantity = item.quantity;
            newItemQuantity.event = newDate;
            items.push(newItemQuantity);
            await this.listRepository.save(list);
          }
        }
      }
      newDate.calendar = calendar;
      newDate.image = createDateDto.image || '';
      console.log('newDate : ', newDate);
      await this.dateRepository.save(newDate);
      for (const item of items) {
        await this.itemQuantityRepository.save(item);
      }
      return newDate;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateDateDto: UpdateDateDto, request: any) {
    const dateToUpdate = await this.dateRepository.findOne({ where: { id } });
    if (!dateToUpdate || dateToUpdate.recipeID !== request.user.sub) {
      return 'Date not found or not yours';
    }
    const updatedDate = { ...dateToUpdate, ...updateDateDto };
    return this.dateRepository.save(updatedDate);
  }

  async remove(id: string, request: any) {
    const dateToRemove = await this.dateRepository.findOne({ where: { id } });
    if (!dateToRemove) {
      throw new NotFoundException('Date not found or not yours');
    }
    try {
      await this.itemQuantityRepository.delete({ event: { id } });
    } catch (error) {
      throw new BadRequestException('Error while deleting the date');
    }
    await this.dateRepository.remove(dateToRemove);
  }

  async removeAllOld() {
    const currentDateUTC = new Date();
    const datesToRemove = await this.dateRepository.find({
      where: {
        date: LessThan(currentDateUTC),
      },
    });
    try {
      await this.itemQuantityRepository.delete({ event: datesToRemove });
    } catch (error) {
      throw new BadRequestException('Error while deleting the date');
    }
    return await this.dateRepository.remove(datesToRemove);
  }

  async findAllQuantityUsedByRecipes(item: item_entity) {
    const itemQuantity = await this.itemQuantityRepository.find({
      where: { item: item },
    });
    let UsedQuantity = 0;
    for (const i of itemQuantity) {
      UsedQuantity += i.quantity;
    }
    return UsedQuantity;
  }

  /* *const isUsedInOtherRecipes = allRecipes.some(recipe => 
    recipe.id !== currentRecipeId && // Exclude the current recipe
    recipe.aliments.some(aliment => alicment.id === item_fridge.aliment.id)
    );

    if (isUsedInOtherRecipes) {
    // item_fridge is used in other recipes
    } else {
  // item_fridge is not used in other recipe */

  async feelCalendar(recipes: recipe_entity[], request: any) {
    const all_date = await this.findAll(
      (
        await this.calendarRepository.findOne({
          where: { user: { id: request.user.sub } },
        })
      ).id,
    );
    const currentDate = new Date();
    let events = [];
    const eventsPerDay = 2;
    let eventsCreated = 0;
    for (const recipe of recipes) {
      let eventsForRecipe = all_date.filter(
        (date) =>
          date.recipeID !== null &&
          date.date.getDate() === currentDate.getDate(),
      );
      console.log(' 1 eventsForRecipe.length : ', eventsForRecipe.length, '\n');
      while (eventsForRecipe.length + eventsCreated >= eventsPerDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        eventsForRecipe = all_date.filter(
          (date) =>
            date.recipeID !== null &&
            date.date.getDate() === currentDate.getDate(),
        );
        eventsCreated = 0;
        console.log(
          ' 1 eventsForRecipe.length : ',
          eventsForRecipe.length,
          '\n',
        );
        if (eventsForRecipe.length < eventsPerDay) break;
        console.log(
          'eventsForRecipe.length >= eventsPerDay new date : ',
          currentDate,
        );
      }
      const event = await this.create(
        {
          date: currentDate.toUTCString(),
          recipeID: recipe.id,
          title: recipe.title,
          image: recipe.image,
          iaGenerated: true,
        },
        request,
      );
      eventsCreated++;
      console.log(
        'event created : ',
        event,
        'currentDate : ',
        currentDate,
        'eventsCreated : ',
        eventsCreated,
      );
      events.push(event);
    }
    return events;
  }
}
