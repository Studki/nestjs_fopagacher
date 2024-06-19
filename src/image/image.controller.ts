import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  Req,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { Readable } from 'stream';
import { Response } from 'express';
import { Public } from 'src/shared/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { image_entity } from './entity/image-file.entity';

@Controller('images')
@ApiTags('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully uploaded.',
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const imageId = await this.imageService.createImage(
        file.originalname,
        file.buffer,
      );
      if (!imageId) {
        throw new BadRequestException('Image not uploaded');
      }
      return { imageId: imageId.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get()
  async getImagesId(): Promise<{ id: string; title: string }[]> {
    return await this.imageService.getAllImageId();
  }

  @Public()
  @Get(':id')
  async getImageById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const image = await this.imageService.getImageById(id);
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      const stream = Readable.from(image.image);

      response.set({
        'Content-Disposition': `inline; filename="${image.title}"`,
        'Content-Type': 'image',
      });

      return new StreamableFile(stream);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'delete an image ihih' })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully uploaded.',
  })
  async deleteImageById(@Param('id') id: string) {
    try {
      await this.imageService.deleteImgById(id);
      return { message: 'damn image deleted zbraaa' };
    } catch (error) {
      throw new BadRequestException('major bruh moment -_-');
    }
  }
}
