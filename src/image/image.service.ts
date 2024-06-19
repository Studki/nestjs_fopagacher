import { BadRequestException, Injectable, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Raw } from 'typeorm';
import { image_entity } from './entity/image-file.entity';
import { v4 as uuidv4, validate as isUUID } from 'uuid';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(image_entity)
    private readonly imageRepository: Repository<image_entity>,
  ) {}

  async createImage(
    title: string,
    imageBuffer: Buffer,
    id?: string,
  ): Promise<image_entity> {
    const newImage = this.imageRepository.create({
      id: id || uuidv4(),
      title,
      image: imageBuffer,
    });
    if (!newImage) {
      throw new BadRequestException('Image not created');
    }
    await this.imageRepository.save(newImage);
    return newImage;
  }

  async getAllImageId(): Promise<{ id: string; title: string }[]> {
    const images = await this.imageRepository.find();
    return images.map((item) => {
      return { id: item.id, title: item.title };
    });
  }

  async getImageById(imageId: string) {
    const image = this.imageRepository.findOne({ where: { id: imageId } });
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    return image;
  }

  async deleteImgById(imageId: string): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    await this.imageRepository.delete(imageId);
  }
}
