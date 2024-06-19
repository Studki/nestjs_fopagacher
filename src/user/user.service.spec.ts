import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './user.service';
import { createUser, PatchUserDto } from './dto/index';
import { user_entity } from './entities/user.entity';
import { Role } from '../enums/roles.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<user_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(user_entity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<user_entity>>(
      getRepositoryToken(user_entity),
    );
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [
        /* create an array of user entities for testing */
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);

      const result = await service.getAllUsers();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('getOneUser', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const user: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(user);

      const result = await service.getOneUser(userId);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw an error if user with the given id does not exist', async () => {
      const userId = '1';
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error('User not found'));

      await expect(service.getOneUser(userId)).rejects.toThrow(
        'User not found',
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: createUser = {
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        imageUrl: '',
      };
      const newUser: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(newUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(newUser);
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(user_entity));
    });
  });

  describe('updateOneUser', () => {
    it('should update a user by id', async () => {
      const userId = '1';
      const patchUserDto: PatchUserDto = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
      };
      const userToUpdate: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValueOnce(userToUpdate);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '' ,// Add an empty string to the imageUrl property,
        fridge: null,
      });

      const result = await service.updateOneUser(userId, patchUserDto);

      expect(result).toEqual({
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        password: '1234',
        tags: [],
        team: null,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(user_entity));
    });
  });

  describe('deleteOneUser', () => {
    it('should delete a user by id', async () => {
      const userId = '1';
      const userToDelete: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValueOnce(userToDelete);
      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(userToDelete);

      const result = await service.deleteOneUser(userId);

      expect(result).toEqual(userToDelete);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(userRepository.remove).toHaveBeenCalledWith(userToDelete);
    });
  });

  describe('postOneUser', () => {
    it('should update and return a user by id', async () => {
      const userId = '1';
      const patchUserDto: PatchUserDto = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
      };
      const userToUpdate: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValueOnce(userToUpdate);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      });

      const result = await service.postOneUser(userId, patchUserDto);

      expect(result).toEqual({
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(user_entity));
    });
  });

  describe('loginUser', () => {
    it('should return a user if email and password match', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(user);

      const result = await service.loginUser(email, password);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should throw an error if email or password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const user: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'd@mail.com',
        username: 'webtest',
        password: '1234',
        tags: [],
        team: null,
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(user);

      await expect(service.loginUser(email, password)).rejects.toThrow(
        'Wrong password',
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
