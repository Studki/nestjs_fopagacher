import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Response } from 'express';
import { image_entity } from './entity/image-file.entity';

describe('ImageController', () => {
    let controller: ImageController;
    let service: ImageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ImageController],
            providers: [ImageService],
        }).compile();

        controller = module.get<ImageController>(ImageController);
        service = module.get<ImageService>(ImageService);
    });

    describe('uploadImage', () => {
        it('should upload an image', async () => {
            // Mock the uploaded file
            const file: Express.Multer.File = {
                fieldname: 'image',
                originalname: 'test.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                size: 1024,
                buffer: Buffer.from('test image data'),
                stream: null,
                destination: null,
                filename: null,
                path: null,
            };

            // Mock the service method
            const uploadImageSpy = jest.spyOn(service, 'uploadImage' as keyof ImageService).mockResolvedValueOnce(Promise.resolve({} as image_entity));

            // Call the controller method
            await controller.uploadImage(file);

            // Assert that the service method was called with the correct arguments
            expect(uploadImageSpy).toHaveBeenCalledWith(file);
        });
    });

    describe('getImageById', () => {
        it('should get an image by ID', async () => {
            const id = '123';
            const response: Response = {} as Response;

            // Mock the service method
            const getImageByIdSpy = jest.spyOn(service, 'getImageById').mockResolvedValueOnce(Promise.resolve({} as image_entity));

            // Call the controller method
            await controller.getImageById(id, response);

            // Assert that the service method was called with the correct arguments
            expect(getImageByIdSpy).toHaveBeenCalledWith(id, response);
        });
    });

    describe('deleteImageById', () => {
        it('should delete an image by ID', async () => {
            const id = '123';

            // Mock the service method
            const deleteImageByIdSpy = jest.spyOn(service, 'deleteImageById'  as keyof ImageService).mockResolvedValueOnce();

            // Call the controller method
            await controller.deleteImageById(id);

            // Assert that the service method was called with the correct arguments
            expect(deleteImageByIdSpy).toHaveBeenCalledWith(id);
        });
    });
});
