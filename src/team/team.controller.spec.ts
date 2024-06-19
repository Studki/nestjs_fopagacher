import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { createTeam, PatchTeamDto } from './dto/index';
import { team_entity } from './entities/team.entity';
import { user_entity } from 'src/user/entities/user.entity';
import { Role } from 'src/enums/roles.enum';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: {
            getAllTeams: jest.fn(),
            createTeam: jest.fn(),
            putTeam: jest.fn(),
            patchTeam: jest.fn(),
            deleteTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
  });

  describe('getAllTeams', () => {
    it('should return an array of teams', async () => {
      const teams: team_entity[] = []; // Define sample teams here

      jest.spyOn(service, 'getAllTeams').mockResolvedValue(teams);

      expect(await controller.getAllTeams()).toBe(teams);
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
        firstname: 'user-pseudo',
        lastname: 'user-lastname',
        email: 'user-email',
        password: 'user-password',
        tags: [],
        team: null,
        username: 'user-username',
        role: Role.User,
        imageUrl: 'user-imageUrl',
      };
      const createdTeam: team_entity = {
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'team-description',
        users: [user],
      };

      jest.spyOn(service, 'createTeam').mockResolvedValue(createdTeam);

      expect(await controller.createTeam(team, user)).toBe(createdTeam);
      expect(service.createTeam).toHaveBeenCalledWith(team, user);
    });
  });

  describe('putTeam', () => {
    it('should update a team using PUT method', async () => {
      const name = 'team-name';
      const team: PatchTeamDto = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'description',
      };
      const updatedTeam: team_entity[] = [{
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'description',
        users: [],
      }];

      jest.spyOn(service, 'patchTeam').mockResolvedValue(updatedTeam);

      expect(await controller.patchTeam(name, team)).toBe(updatedTeam);
      expect(service.patchTeam).toHaveBeenCalledWith(name, team);
    });
  });

  describe('patchTeam', () => {
    it('should update a team using PATCH method', async () => {
      const name = 'team-name';
      const team: PatchTeamDto = {
        name: 'team-name',
        tag: 'team-tag',
        description: 'description',
      };
      const updatedTeam: team_entity[] = [{
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'description',
        users: [],
      }];
      jest.spyOn(service, 'patchTeam').mockResolvedValue(updatedTeam);

      expect(await controller.patchTeam(name, team)).toBe(updatedTeam);
      expect(service.patchTeam).toHaveBeenCalledWith(name, team);
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      const tag = 'team-tag';
      const deletedTeam: team_entity[] = [{
        id: 1,
        name: 'team-name',
        tag: 'team-tag',
        description: 'description',
        users: [],
      }];

      jest.spyOn(service, 'deleteTeam').mockResolvedValue(deletedTeam);

      expect(await controller.deleteTeam(tag)).toBe(deletedTeam);
      expect(service.deleteTeam).toHaveBeenCalledWith(tag);
    });
  });
});
