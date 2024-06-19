import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { event_entity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDateDto } from './dto/update-event.dto';
import { calendar_entity } from 'src/calendar/entities/calendar.entity';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { Query } from '@nestjs/common';

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
  ) {}

  async findOne(id: string, request: any) {
    const date = this.dateRepository.findOne({ where: { id } });
    return date;
  }

  async findCurrent() {
    const currentDateUTC = new Date().toUTCString();
    return currentDateUTC;
  }

  async findAll() {
    return this.dateRepository.find();
  }

  async create(createDateDto: CreateEventDto, req: any, @Query('fridgeId') fridgeId?: string) {
    try {
      const currentDate = new Date().toUTCString();
      if (createDateDto.date < currentDate) {
        return 'Date must be in the future';
      }
      const date = new Date(createDateDto.date);
      const calendar = await this.calendarRepository.findOne({
        where: { user: { id: req.user.sub } },
      });

      const newDate = new event_entity();
      newDate.date = date;
      newDate.recipeID = createDateDto.recipeID;
      const recipeID = { where: { id: createDateDto.recipeID },  relations: ['aliments'] };

      const recipe = await this.recipeRepository.findOne(recipeID);
      
        if (!recipe) {
        return 'Recipe not found';
      }
      const ingredients = recipe.aliments;
      const fridge = await this.fridgeRepository.findOne({ where: { id: fridgeId }, relations: ['aliments'] });
      console.log(fridge);
      if (!fridge) {
        return 'Fridge not found';
      }

      for (const ingredient of ingredients) {
        const item = await this.itemRepository.findOne({ where: { id: ingredient.id }, relations: ['aliment'] });
        if (!item) {
          console.log('Item not found');
        }
        for (const f of fridge.aliments) {
          const item_fridge = await this.itemRepository.findOne({ where: { id: f.id }, relations: ['aliment'] });
          if (!item_fridge) {
            console.log('Item not found');
          }
          if ((item.aliment.id === item_fridge.aliment.id) && (item.quantity <= item_fridge.quantity)) {
            console.log('Aliment found in the fridge');
            
            break;
          } else if ((item.aliment.id === item_fridge.aliment.id) && (item.quantity > item_fridge.quantity)) {
            console.log('Aliment found in the fridge but not enough quantity');
            //cancel 
            break;
          } else {
            console.log('Aliment not found in the fridge');
            //futur
          }
        }
        //const matchingAliment = fridge.aliments.findOne(aliment => aliment.id === item.aliment.id);
        /*if (!matchingAliment) {
          console.log('Aliment not found in the fridge');
        }*/
        // Do something with the matching aliment
        /*console.log(aliment);
        if (!aliment) {
          console.log("aliment not found");
        } else {
          console.log(aliment);
        }*/
      }

      //get what the user need to buy

      // Associate aliment from the user to the recipe date, if doesn't existe add the aliment in the user default list

      newDate.calendar = calendar;
      await this.dateRepository.save(newDate);
      return newDate;
    } catch (error) {
      return error.message;
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
    if (!dateToRemove || dateToRemove.recipeID !== request.user.sub) {
      return 'Date not found or not yours';
    }
    return this.dateRepository.remove(dateToRemove);
  }

  async removeAllOld() {
    const currentDateUTC = new Date();
    const datesToRemove = await this.dateRepository.find({
      where: {
        date: LessThan(currentDateUTC),
      },
    });
    // Remove them
    return this.dateRepository.remove(datesToRemove);
  }
}
