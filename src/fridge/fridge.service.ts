import { BadRequestException, Injectable, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Raw } from 'typeorm';
import { fridge_entity } from './entities/fridge.entity';
import { AlimentsService } from '../aliment/aliment.service';
import {
  AlimentDto,
  UpdateFridgeDto,
  CreateFridgeDto,
  FridgeDetailsDTO,
} from './dto/index';
import { UsersService } from '../user/user.service';
import axios from 'axios';
import { user_entity } from 'src/user/entities/user.entity';
import { item_entity } from 'src/item/entities/item.entity';
import { itemService } from 'src/item/item.service';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import GlobalService from 'src/GlobalVars/globalVars.service';
import { image_entity } from 'src/image/entity/image-file.entity';
import { ImageService } from 'src/image/image.service';
@Injectable()
export class FridgeService {
  constructor(
    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,
    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,
    private readonly usersService: UsersService,
    @InjectRepository(item_entity)
    private readonly itemRepository: Repository<item_entity>,
    private readonly itemSerivce: itemService,
    @InjectRepository(aliment_entity)
    private readonly alimentRepository: Repository<aliment_entity>,
    private readonly alimentsService: AlimentsService,
    @InjectRepository(image_entity)
    private readonly imageRepository: Repository<image_entity>,
    private readonly imageService: ImageService,
  ) {}

  async findOne(id: string) {
    const fridge = await this.fridgeRepository.findOne({
      where: { id },
      relations: ['aliments', 'aliments.aliment'],
    });
    if (!fridge) {
      throw new BadRequestException('Fridge not found');
    }
    return fridge;
  }

  async getImagesService(): Promise<string[]> {
    const uuids: string[] = [
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      '123e4567-e89b-12d3-a456-426614174000',
      '9c858901-8a57-4791-81fe-4c455b099bc9',
      'f86c9f7e-4f4e-40d8-9b63-6cdb74a7e8da',
    ];
    return uuids;
  }

  async findAll(user: any) {
    const myUser = await this.usersService.getOneUser(user.user.sub);
    if (myUser.role === 'admin') {
      return this.fridgeRepository.find({
        relations: ['users', 'aliments', 'aliments.aliment'],
      });
    } else {
      const fridges = await this.fridgeRepository
        .createQueryBuilder('fridge')
        .leftJoinAndSelect('fridge.users', 'user')
        .where('user.id = :userId', { userId: myUser.id })
        .getMany();
      const fridgeDetails: FridgeDetailsDTO[] = fridges.map((fridge) => {
        return {
          id: fridge.id,
          title: fridge.title,
          description: fridge.description,
          foods: fridge.aliments,
          image: fridge.image,
        };
      });

      return fridgeDetails;
    }
  }

  async create(createFrigeDto: CreateFridgeDto, jwt: any) {
    const userId = jwt.user.sub;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isUserSubscribed = user.isSubcribed;
    const userFridgeCount = await this.countUserFridge(jwt);

    GlobalService.fridgeLimit = 1;
    if (!isUserSubscribed && GlobalService.fridgeLimit <= userFridgeCount) {
      throw new BadRequestException(
        'You have reached the maximum number of fridges',
      );
    }

    const newFridge = new fridge_entity();
    newFridge.title = createFrigeDto.title;
    newFridge.description = createFrigeDto.description;
    // newFridge.image = createFrigeDto.image;
    newFridge.aliments = [];
    newFridge.users = [user];
    newFridge.image = createFrigeDto.image;
    return await this.fridgeRepository.save(newFridge);
  }

  async update(id: string, updateFridgeDto: UpdateFridgeDto) {
    const fridgeToUpdate = await this.fridgeRepository.findOne({
      where: { id },
    });
    if (!fridgeToUpdate) {
      return null;
    }
    if (updateFridgeDto.title) {
      fridgeToUpdate.title = updateFridgeDto.title;
    }
    if (updateFridgeDto.description) {
      fridgeToUpdate.description = updateFridgeDto.description;
    }
    if (updateFridgeDto.image) {
      fridgeToUpdate.image = updateFridgeDto.image;
    }
    return this.fridgeRepository.save(fridgeToUpdate);
  }

  async remove(id: string, request: any) {
    const userId = request.user.sub;
    const myUser = await this.usersService.getOneUser(userId);

    if (!myUser) {
      throw new BadRequestException('User not found');
    }

    const fridgeToRemove = await this.fridgeRepository
      .createQueryBuilder('fridge')
      .leftJoinAndSelect('fridge.users', 'user')
      .where('fridge.id = :fridgeId', { fridgeId: id })
      .andWhere(myUser.role !== 'admin' ? 'user.id = :userId' : '1=1', {
        userId,
      })
      .getOne();

    if (!fridgeToRemove) {
      throw new BadRequestException(
        'Fridge not found or you do not have permission to remove this fridge',
      );
    }

    fridgeToRemove.aliments = [];
    console.log(fridgeToRemove);
    await this.fridgeRepository.remove(fridgeToRemove);

    return { message: 'Fridge removed successfully' };
  }

  async addAliment(id: string, aliment: AlimentDto) {
    const fridgeToUpdate = await this.fridgeRepository.findOne({
      where: { id },
    });
    if (!fridgeToUpdate) {
      return null;
    }
    const itemToAdd = await this.itemRepository.findOne({
      where: { id: aliment.itemId },
    });
    if (!itemToAdd) {
      return null;
    }
    fridgeToUpdate.aliments.push(itemToAdd);
    return this.fridgeRepository.save(fridgeToUpdate);
  }

  async removeAliment(id: string, aliment: AlimentDto) {
    const fridgeToUpdate = await this.fridgeRepository.findOne({
      where: { id },
    });
    if (!fridgeToUpdate) {
      return null;
    }
    const itemToRemove = await this.itemRepository.findOne({
      where: { id: aliment.itemId },
    });
    if (!itemToRemove) {
      return null;
    }
    fridgeToUpdate.aliments = fridgeToUpdate.aliments.filter(
      (aliment) => aliment.id !== itemToRemove.id,
    );
    return this.fridgeRepository.save(fridgeToUpdate);
  }

  async removeAllAliment(id: string) {
    const fridgeToUpdate = await this.fridgeRepository.findOne({
      where: { id },
    });
    if (!fridgeToUpdate) {
      return null;
    }
    fridgeToUpdate.aliments = [];
    return this.fridgeRepository.save(fridgeToUpdate);
  }

  async getAllAliments(id: string) {
    const fridgeToUpdate = await this.fridgeRepository.findOne({
      where: { id },
    });
    if (!fridgeToUpdate) {
      return null;
    }
    if (fridgeToUpdate.aliments === undefined) {
      console.log('undefined');
    }
    return fridgeToUpdate.aliments;
  }

  async findOneAliment(id: string, tag: string) {
    const fridgeToUpdate = await this.fridgeRepository.findOne({
      where: { id },
    });
    if (!fridgeToUpdate) {
      return null;
    }
  }

  async countUserFridge(user: any) {
    const userId = user.user.sub;

    const count = await this.fridgeRepository
      .createQueryBuilder('fridge')
      .innerJoin('fridge.users', 'user', 'user.id = :userId', { userId })
      .getCount();

    console.log(count);
    return count;
  }

  async callAI(image: any, request: any) {
    const userUUID = request.user.sub;
    const url = `http://ai.patzenhoffer.eu/picture/found_aliment_in_image/`;

    if (!image) {
      throw new BadRequestException('No image found');
    }
    const formData = new FormData();
    formData.append('user', userUUID);
    const blob = new Blob([image.buffer], { type: image.mimetype });
    formData.append('image', blob, image.originalname);

    const response = await axios.post(url, formData);
    if (response.data.aliments.length <= 0) {
      throw new BadRequestException('No aliments found in the image');
    }
    const aliments: { aliment: aliment_entity; quantity: number }[] = [];
    for (let index = 0; index < response.data.aliments.length; index++) {
      const aliment = await this.alimentRepository.findOne({
        where: { title: response.data.aliments[index].name },
      });
      if (aliment) {
        aliments.push({
          aliment: aliment,
          quantity: response.data.aliments[index].quantity,
        });
      }
    }
    if (aliments.length <= 0) {
      throw new BadRequestException('No aliments found in the image');
    }
    return aliments;
  }
}
