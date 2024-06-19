import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from './image.service';
import { image_entity } from './entity/image-file.entity';
import { BadRequestException } from '@nestjs/common';

describe('ImageService', () => {
    let service: ImageService;
    let repository: Repository<image_entity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: getRepositoryToken(image_entity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ImageService>(ImageService);
        repository = module.get<Repository<image_entity>>(
            getRepositoryToken(image_entity),
        );
    });

    describe('createImage', () => {
        it('should create a new image', async () => {
            // Arrange
            const title = 'Test Image';
            const imageBuffer = Buffer.from('test image buffer');

            // Act
            const createdImage = await service.createImage(title, imageBuffer);

            // Assert
            expect(createdImage).toBeDefined();
            expect(createdImage.title).toBe(title);
            expect(createdImage.image).toBe(imageBuffer);
        });
    });

    describe('getImageById', () => {
        it('should get an image by ID', async () => {
        describe('ImageService', () => {

            describe('getImageById', () => {
                it('should get an image by ID', async () => {
                    // Arrange
                    const imageId = '123';

                    const expectedImage: image_entity = {
                        id: imageId,
                        title: 'Test Image',
                        image: Buffer.from('test image buffer'),
                    };

                    jest.spyOn(repository, 'findOne').mockResolvedValue(expectedImage);

                    // Act
                    const result = await service.getImageById(imageId);

                    // Assert
                    expect(result).toEqual(expectedImage);
                    expect(repository.findOne).toHaveBeenCalledWith(imageId);
                });

                it('should throw an error if image is not found', async () => {
                    // Arrange
                    const imageId = '123';

                    jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

                    // Act and Assert
                    await expect(service.getImageById(imageId)).rejects.toThrow(BadRequestException);
                    expect(repository.findOne).toHaveBeenCalledWith(imageId);
                });
            });
        });
    });

    describe('deleteImgById', () => {
        it('should delete an image by ID', async () => {
            // Arrange
            const imageId = '123';

            const expectedImage: image_entity = {
                id: imageId,
                title: 'Test Image',
                image: Buffer.from('test image buffer'),
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(expectedImage);

            // Act
            await service.deleteImgById(imageId);

            // Assert
            expect(repository.findOne).toHaveBeenCalledWith(imageId);
            expect(repository.delete).toHaveBeenCalledWith(imageId);
        });
    });
});
