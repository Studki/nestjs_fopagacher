import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { team_entity } from './entities/team.entity';
import { createTeam, PatchTeamDto } from './dto/index';
import { user_entity } from '../user/entities/user.entity';
import { Role } from '../enums/roles.enum';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: Repository<team_entity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(team_entity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepository = module.get<Repository<team_entity>>(
      getRepositoryToken(team_entity),
    );
  });

  describe('getAllTeams', () => {
    it('should return an array of teams', async () => {
      const teams: team_entity[] = []; // Define sample teams here

      jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);

      expect(await service.getAllTeams()).toBe(teams);
      expect(teamRepository.find).toHaveBeenCalled();
    });
  });

  describe('createTeam', () => {
    it('should create a new team', async () => {
      const team: createTeam = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
      };
      const user: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'user-email',
        password: 'user-password',
        tags: [],
        team: null,
        username: '',
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      const createdTeam: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [user],
      };

      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(teamRepository, 'save').mockResolvedValue(createdTeam);

      expect(await service.createTeam(team, user)).toBe(createdTeam);
      expect(teamRepository.findOne).toHaveBeenCalledWith({
        where: { name: expect.any(String) },
      });
      expect(teamRepository.save).toHaveBeenCalledWith(expect.any(team_entity));
    });

    it('should throw an error if the team already exists', async () => {
      const team: createTeam = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
      };
      const user: user_entity = {
        id: '1',
        firstname: 'rt',
        lastname: 'webtest',
        email: 'user-email',
        password: 'user-password',
        tags: [],
        team: null,
        username: '',
        role: Role.User,
        imageUrl: '',
        fridge: null,
      };
      const existingTeam: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [user],
      };
      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(existingTeam);

      await expect(service.createTeam(team, user)).rejects.toThrowError(
        'Team already exists',
      );
      expect(teamRepository.findOne).toHaveBeenCalledWith({
        where: { name: expect.any(String) },
      });
      expect(teamRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('putTeam', () => {
    it('should update a team using PUT method', async () => {
      const name = 'team-name'; // Define sample name here
      const team: PatchTeamDto = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
      };
      const teamToUpdate: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [],
      };
      jest
        .spyOn(teamRepository, 'findOneOrFail')
        .mockResolvedValue(teamToUpdate);
      jest.spyOn(teamRepository, 'save').mockResolvedValue(teamToUpdate);

      expect(await service.patchTeam(name, team)).toBe(teamToUpdate);
      expect(teamRepository.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(teamRepository.save).toHaveBeenCalledWith(expect.any(team_entity));
    });
  });

  describe('patchTeam', () => {
    it('should update a team using PATCH method', async () => {
      const name = 'team-name';
      const team: PatchTeamDto = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
      };
      const teamToUpdate: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [],
      };

      jest
        .spyOn(teamRepository, 'findOneOrFail')
        .mockResolvedValue(teamToUpdate);
      jest.spyOn(teamRepository, 'save').mockResolvedValue(teamToUpdate);

      expect(await service.patchTeam(name, team)).toBe(teamToUpdate);
      expect(teamRepository.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(teamRepository.save).toHaveBeenCalledWith(expect.any(team_entity));
    });
  });

  describe('patchOneTeam', () => {
    it('should update a team using PATCH method', async () => {
      const id = 1;
      const team: PatchTeamDto = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description-changed',
      };
      const teamToUpdate: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [],
      };
      jest
        .spyOn(teamRepository, 'findOneOrFail')
        .mockResolvedValue(teamToUpdate);
      jest.spyOn(teamRepository, 'save').mockResolvedValue(teamToUpdate);

      expect(await service.patchOneTeam(id, team)).toBe(teamToUpdate);
      expect(teamRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      const tag = 'team-tag';
      const teamToDelete: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [],
      };

      jest
        .spyOn(teamRepository, 'findOneOrFail')
        .mockResolvedValue(teamToDelete);
      jest.spyOn(teamRepository, 'remove').mockResolvedValue(teamToDelete);

      expect(await service.deleteTeam(tag)).toBe(teamToDelete);
      expect(teamRepository.findOne).toHaveBeenCalledWith({
        where: { tag },
      });
      expect(teamRepository.remove).toHaveBeenCalledWith(
        expect.any(teamToDelete),
      );
    });
  });
});
