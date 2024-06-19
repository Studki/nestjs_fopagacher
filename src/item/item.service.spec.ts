import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { itemService } from './item.service';
import { item_entity } from './entities/item.entity';
import { CreateItem } from './dto/create-item.dto';
import { BadRequestException } from '@nestjs/common';
import { aliment_entity } from 'src/aliment/entities/aliment.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';
import { list_entity } from 'src/list/entities/list.entity';

describe('itemService', () => {
    let service: itemService;
    let itemRepository: Repository<item_entity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                itemService,
                {
                    provide: getRepositoryToken(item_entity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<itemService>(itemService);
        itemRepository = module.get<Repository<item_entity>>(
            getRepositoryToken(item_entity),
        );
    });

    describe('createitem', () => {
        let service: itemService;
        let itemRepository: Repository<item_entity>;
        let alimentRepository: Repository<aliment_entity>;
        let fridgeRepository: Repository<fridge_entity>;
        let listRepository: Repository<list_entity>;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    itemService,
                    {
                        provide: getRepositoryToken(item_entity),
                        useClass: Repository,
                    },
                    {
                        provide: getRepositoryToken(aliment_entity),
                        useClass: Repository,
                    },
                    {
                        provide: getRepositoryToken(fridge_entity),
                        useClass: Repository,
                    },
                    {
                        provide: getRepositoryToken(list_entity),
                        useClass: Repository,
                    },
                ],
            }).compile();

            service = module.get<itemService>(itemService);
            itemRepository = module.get<Repository<item_entity>>(
                getRepositoryToken(item_entity),
            );
            alimentRepository = module.get<Repository<aliment_entity>>(
                getRepositoryToken(aliment_entity),
            );
            fridgeRepository = module.get<Repository<fridge_entity>>(
                getRepositoryToken(fridge_entity),
            );
            listRepository = module.get<Repository<list_entity>>(
                getRepositoryToken(list_entity),
            );
        });

        describe('createitem', () => {
            it('should create items for fridge successfully', async () => {
                // Mock the necessary dependencies
                const user = { user: { sub: 'user-id' } };
                const createitemDto = {
                    alimentName: ['aliment1', 'aliment2'],
                    quantity: [1, 2],
                    fridgeId: 'fridge-id',
                };

                const aliment1 = new aliment_entity();
                aliment1.title = 'aliment1';
                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(aliment1),
                } as any);

                const fridge = new fridge_entity();
                fridge.id = 'fridge-id';
                fridge.aliments = [];
                jest.spyOn(fridgeRepository, 'findOne').mockResolvedValueOnce(fridge);

                const savedItem1 = new item_entity();
                savedItem1.aliment = aliment1;
                savedItem1.quantity = 1;
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(savedItem1);

                const aliment2 = new aliment_entity();
                aliment2.title = 'aliment2';
                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(aliment2),
                } as any);

                const savedItem2 = new item_entity();
                savedItem2.aliment = aliment2;
                savedItem2.quantity = 2;
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(savedItem2);

                // Call the method
                const result = await service.createitem(user, createitemDto);

                // Assertions
                expect(result).toEqual([savedItem1, savedItem2]);
                expect(fridge.aliments).toEqual([savedItem1, savedItem2]);
            });

            it('should create items for list successfully', async () => {
                // Mock the necessary dependencies
                const user = { user: { sub: 'user-id' } };
                const createitemDto = {
                    alimentName: ['aliment1', 'aliment2'],
                    quantity: [1, 2],
                    listId: 'list-id',
                };

                const aliment1 = new aliment_entity();
                aliment1.title = 'aliment1';
                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(aliment1),
                } as any);

                const list = new list_entity();
                list.id = 'list-id';
                list.aliments = [];
                jest.spyOn(listRepository, 'findOne').mockResolvedValueOnce(list);

                const savedItem1 = new item_entity();
                savedItem1.aliment = aliment1;
                savedItem1.quantity = 1;
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(savedItem1);

                const aliment2 = new aliment_entity();
                aliment2.title = 'aliment2';
                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(aliment2),
                } as any);

                const savedItem2 = new item_entity();
                savedItem2.aliment = aliment2;
                savedItem2.quantity = 2;
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(savedItem2);

                // Call the method
                const result = await service.createitem(user, createitemDto);

                // Assertions
                expect(result).toEqual([savedItem1, savedItem2]);
                expect(list.aliments).toEqual([savedItem1, savedItem2]);
            });

            it('should create standalone items successfully', async () => {
                // Mock the necessary dependencies
                const user = { user: { sub: 'user-id' } };
                const createitemDto = {
                    alimentName: ['aliment1', 'aliment2'],
                    quantity: [1, 2],
                };

                const aliment1 = new aliment_entity();
                aliment1.title = 'aliment1';
                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(aliment1),
                } as any);

                const savedItem1 = new item_entity();
                savedItem1.aliment = aliment1;
                savedItem1.quantity = 1;
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(savedItem1);

                const aliment2 = new aliment_entity();
                aliment2.title = 'aliment2';
                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(aliment2),
                } as any);

                const savedItem2 = new item_entity();
                savedItem2.aliment = aliment2;
                savedItem2.quantity = 2;
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(savedItem2);

                // Call the method
                const result = await service.createitem(user, createitemDto);

                // Assertions
                expect(result).toEqual([savedItem1, savedItem2]);
            });

            it('should throw BadRequestException if aliment is not found', async () => {
                // Mock the necessary dependencies
                const user = { user: { sub: 'user-id' } };
                const createitemDto = {
                    alimentName: ['aliment1'],
                    quantity: [1],
                };

                jest.spyOn(alimentRepository, 'createQueryBuilder').mockReturnValueOnce({
                    where: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockResolvedValueOnce(undefined),
                } as any);

                // Call the method and assert that it throws BadRequestException
                await expect(service.createitem(user, createitemDto)).rejects.toThrow(
                    BadRequestException,
                );
            });

            it('should throw BadRequestException if alimentName and quantity arrays have different lengths', async () => {
                // Mock the necessary dependencies
                const user = { user: { sub: 'user-id' } };
                const createitemDto = {
                    alimentName: ['aliment1', 'aliment2'],
                    quantity: [1],
                };

                // Call the method and assert that it throws BadRequestException
                await expect(service.createitem(user, createitemDto)).rejects.toThrow(
                    BadRequestException,
                );
            });
        });
    });

    describe('getAllItems', () => {
        it('should return all items with their related aliments', async () => {
            // Mock the necessary dependencies
            const expectedItems: item_entity[] = [
                { id: '1', aliment: { id: '1', title: 'aliment1' }, quantity: 1 },
                { id: '2', aliment: { id: '2', title: 'aliment2' }, quantity: 2 },
            ];
            jest.spyOn(itemRepository, 'find').mockResolvedValueOnce(expectedItems);

            // Call the method
            const result = await service.getAllItems();

            // Assertions
            expect(result).toEqual(expectedItems);
            expect(itemRepository.find).toHaveBeenCalledWith({ relations: ['aliment'] });
        });
    });

    describe('updateItemQuantities', () => {
        it('should update the quantities of items', async () => {
            // Arrange
            const itemsId: string[] = ['1', '2', '3'];
            const quantities: number[] = [10, 20, 30];

            const findOneSpy = jest.spyOn(itemRepository, 'findOne');
            const saveSpy = jest.spyOn(itemRepository, 'save');

            // Mock the findOne method to return items
            findOneSpy.mockImplementation((query) => {
                const itemId = query.where?.id;
                if (itemId === '1') {
                    return Promise.resolve({ id: '1', quantity: 5 });
                } else if (itemId === '2') {
                    return Promise.resolve({ id: '2', quantity: 15 });
                } else if (itemId === '3') {
                    return Promise.resolve({ id: '3', quantity: 25 });
                }
                return Promise.resolve(null);
            });

            // Act
            const result = await service.updateItemQuantities(itemsId, quantities);

            // Assert
            expect(findOneSpy).toHaveBeenCalledTimes(3);
            expect(saveSpy).toHaveBeenCalledTimes(3);
            expect(result).toEqual([
                { id: '1', quantity: 10 },
                { id: '2', quantity: 20 },
                { id: '3', quantity: 30 },
            ]);
        });

        it('should throw BadRequestException if itemsId and quantities arrays have different lengths', async () => {
            // Arrange
            const itemsId: string[] = ['1', '2'];
            const quantities: number[] = [10, 20, 30];

            // Act and Assert
            await expect(service.updateItemQuantities(itemsId, quantities)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw BadRequestException if an item is not found', async () => {
            // Arrange
            const itemsId: string[] = ['1', '2'];
            const quantities: number[] = [10, 20];

            const findOneSpy = jest.spyOn(itemRepository, 'findOne');

            // Mock the findOne method to return null for the second item
            //findOneSpy.mockResolvedValueOnce({ id: '1', quantity: 5 });
            findOneSpy.mockResolvedValueOnce(null);

            // Act and Assert
            await expect(service.updateItemQuantities(itemsId, quantities)).rejects.toThrow(
                BadRequestException,
            );

            expect(findOneSpy).toHaveBeenCalledTimes(2);
        });
    });



    describe('additemToFridge', () => {
        let service: itemService;
        let itemRepository: Repository<item_entity>;
        let fridgeRepository: Repository<fridge_entity>;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    itemService,
                    {
                        provide: getRepositoryToken(item_entity),
                        useClass: Repository,
                    },
                    {
                        provide: getRepositoryToken(fridge_entity),
                        useClass: Repository,
                    },
                ],
            }).compile();
            it('should add an item to the fridge and set the expiration date', async () => {
                // Arrange
                const user = { user: { sub: 'user-id' } };
                const additemToFridgeDto = {
                    itemId: 'item-id',
                    fridgeId: 'fridge-id',
                };

                const item: item_entity = { id: 'item-id', aliment: {}, fridge: null, list: null };
                const isAlreadyLinked: item_entity = { id: 'item-id', aliment: {}, fridge: {}, list: {}, recipe: {}, item_recipe: {} };
                const fridge: fridge_entity = { id: 'fridge-id', title: 'fridge', aliments: [], description: 'description', user: {}, teams: [] };

                jest.spyOn(itemRepository, 'findOne').mockResolvedValueOnce(item);
                jest.spyOn(itemRepository, 'findOne').mockResolvedValueOnce(isAlreadyLinked);
                jest.spyOn(fridgeRepository, 'findOne').mockResolvedValueOnce(fridge);
                jest.spyOn(itemRepository, 'save').mockResolvedValueOnce(item);

                const expectedExpirationDate = new Date();
                expectedExpirationDate.setDate(expectedExpirationDate.getDate() + 7);

                // Act
                const result = await service.additemToFridge(user, additemToFridgeDto);

                // Assert
                expect(itemRepository.findOne).toHaveBeenCalledWith({
                    where: { id: additemToFridgeDto.itemId },
                    relations: ['aliment', 'fridge', 'list'],
                });
                expect(itemRepository.findOne).toHaveBeenCalledWith({
                    where: { id: additemToFridgeDto.itemId },
                    relations: ['fridge'],
                });
                expect(fridgeRepository.findOne).toHaveBeenCalledWith({
                    where: { id: additemToFridgeDto.fridgeId },
                });
                expect(item.fridge).toBe(fridge);
                expect(item.expirationDate).toEqual(expectedExpirationDate);
                expect(itemRepository.save).toHaveBeenCalledWith(item);
                expect(result).toBe(item);
            });

            it('should throw BadRequestException if the item is already linked to a fridge', async () => {
                // Arrange
                const user = { user: { sub: 'user-id' } };
                const additemToFridgeDto = {
                    itemId: 'item-id',
                    fridgeId: 'fridge-id',
                };

                const isAlreadyLinked = { id: 'item-id', fridge: {} };

                jest.spyOn(itemRepository, 'findOne').mockResolvedValueOnce(isAlreadyLinked);

                // Act and Assert
                await expect(service.additemToFridge(user, additemToFridgeDto)).rejects.toThrow(
                    BadRequestException,
                );

                expect(itemRepository.findOne).toHaveBeenCalledWith({
                    where: { id: additemToFridgeDto.itemId },
                    relations: ['fridge'],
                });
            });

            it('should throw BadRequestException if the fridge is not found', async () => {
                // Arrange
                const user = { user: { sub: 'user-id' } };
                const additemToFridgeDto = {
                    itemId: 'item-id',
                    fridgeId: 'fridge-id',
                };

                jest.spyOn(itemRepository, 'findOne').mockResolvedValueOnce(null);
                jest.spyOn(fridgeRepository, 'findOne').mockResolvedValueOnce(null);

                // Act and Assert
                await expect(service.additemToFridge(user, additemToFridgeDto)).rejects.toThrow(
                    BadRequestException,
                );

                expect(itemRepository.findOne).toHaveBeenCalledWith({
                    where: { id: additemToFridgeDto.itemId },
                    relations: ['aliment', 'fridge', 'list'],
                });
                expect(fridgeRepository.findOne).toHaveBeenCalledWith({
                    where: { id: additemToFridgeDto.fridgeId },
                });
            });
        });
    });
});