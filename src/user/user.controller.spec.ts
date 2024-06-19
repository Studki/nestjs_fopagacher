import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { createUser, PatchUserDto } from './dto/index';
import { user_entity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: Repository<user_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(user_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<user_entity>>(
      getRepositoryToken(user_entity),
    );
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: user_entity[] = [
        {
          id: '0',
          firstname: 'rt',
          lastname: 'webtest',
          email: 'webtest@test.com',
          username: 'webtest',
          password: '1234',
          tags: null,
          team: null,
          role: Role.User,
          imageUrl: 'https://example.com/image.jpg', // Add imageUrl property,
          fridge: null,
        },
      ];
      jest
        .spyOn(service, 'getAllUsers')
        .mockResolvedValue(
          users.map((user) => ({ ...user, id: user.id.toString() })),
        );

      const allUsers = await controller.getAllUsers();

      expect(allUsers).toBe(users);
    });
  });

  describe('getOneUser', () => {
    it('should return a user by id', async () => {
      const userId = '0';
      const user: user_entity = {
        id: '0',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'webtest@test.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest
        .spyOn(service, 'getOneUser')
        .mockResolvedValue({ ...user, id: String(user.id) });

      const result = await controller.getOneUser(userId);

      expect(result).toBe(user);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: createUser = {
        firstname: 'rt',
        lastname: 'webtest',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
        imageUrl: '',
      };
      const createdUser: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(service, 'createUser');

      const result = await controller.createUser(user);

      expect(result).toBe(createdUser);
    });
  });

  describe('updateOneUser', () => {
    it('should update a user by id', async () => {
      const userId = '1';
      const updatedUser: PatchUserDto = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'webtest@test.com',
        username: 'webtest',
        password: '12334',
        tags: [],
      };
      const user: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'webtest@test.com',
        username: 'webtest',
        password: '12334',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(service, 'updateOneUser').mockResolvedValue(user);

      const result = await controller.patchOneUser(userId, updatedUser);

      expect(result).toBe(user);
    });
  });

  describe('deleteOneUser', () => {
    it('should delete a user by id', async () => {
      const userId = '0';
      const deletedUser: user_entity = {
        id: '0',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'webtest@test.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(service, 'deleteOneUser').mockResolvedValue(deletedUser);

      const result = await controller.deleteUser(userId);

      expect(result).toBe(deletedUser);
    });
  });

  describe('loginUser', () => {
    it('should return a user with access token when login is successful', async () => {
      const email = 'webtest@test.com';
      const password = '1234';

      // Mock the successful login
      jest.spyOn(service, 'loginUser').mockResolvedValue({
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvcnkudHJpc3RhbjkyQGdtYWlsLmNvbSIsInN1YiI6MSwiaWF0IjoxNjg5ODY1ODAzLCJleHAiOjE2ODk4Njk0MDN9.9SyBjw7o05lPD-6TYp7cfziyb3v72DkCYy4WDpguLso',
        id: '1',
        mail: 'webtest@test.com',
        username: 'webtest',
        firstname: 'rt',
        lastname: 'webtest',
        imageUrl: ''
      });

      const result: {
        access_token: string;
        id: string;
        mail: string;
        username: string;
        firstname: string;
        lastname: string;
        imageUrl: string;
      } = await controller.loginUser(email, password);

      expect(result).toEqual({
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvcnkudHJpc3RhbjkyQGdtYWlsLmNvbSIsInN1YiI6MSwiaWF0IjoxNjg5ODY1ODAzLCJleHAiOjE2ODk4Njk0MDN9.9SyBjw7o05lPD-6TYp7cfziyb3v72DkCYy4WDpguLso',
        id: '1',
        mail: 'webtest@test.com',
        username: 'webtest',
        firstname: 'rt',
        lastname: 'webtest',
        imageUrl: ''
      });
    });

    it('should throw an error when login fails', async () => {
      const email = 'webtest@test.com';
      const password = 'wrongpassword';

      // Mock the login failure
      jest
        .spyOn(service, 'loginUser')
        .mockRejectedValue(
          new NotFoundException('User not found or invalid password'),
        );

      await expect(controller.loginUser(email, password)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
