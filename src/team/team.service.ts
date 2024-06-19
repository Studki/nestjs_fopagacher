import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { team_entity } from './entities/team.entity';
import { createTeam, PatchTeamDto } from './dto/index';
import { user_entity } from '../user/entities/user.entity';
import { fridge_entity } from 'src/fridge/entities/fridge.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(team_entity)
    private readonly teamRepository: Repository<team_entity>,
    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,
    @InjectRepository(fridge_entity)
    private readonly fridgeRepository: Repository<fridge_entity>,
  ) { }

  async getAllTeams(): Promise<team_entity[]> {
    return await this.teamRepository.find();
  }

  async getOneTeam(id: string): Promise<team_entity> {
    return await this.teamRepository.findOne({ where: { id } });
  }

  async getTeam(tag: string): Promise<team_entity[]> {
    return await this.teamRepository.find({ where: { tag }, relations: ['users', 'fridges'] });
  }

  async createTeam(team: createTeam, userId): Promise<team_entity> {
    const newTeam = new team_entity();
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    newTeam.title = team.title;
    if (
      await this.teamRepository.findOne({ where: { title: newTeam.title } })
    ) {
      throw new BadRequestException('Team already exists');
    }
    console.log(user);
    newTeam.tag = team.tag;
    newTeam.description = team.description;
    newTeam.users = [user];
    newTeam.fridges = [];
    return await this.teamRepository.save(newTeam);
  }

  async getTeamWithUsers(id: string): Promise<team_entity> {
    return await this.teamRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async addFridgeToTeam(id: string, fridgeId: string): Promise<team_entity> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['fridges', 'users'],
    });
    if (!team) {
      throw new BadRequestException('Team not found');
    }
    const fridge = await this.fridgeRepository.findOne({
      where: { id: fridgeId },
    });
    if (!fridge) {
      throw new BadRequestException('Fridge not found');
    }

    const alreadyAdded = team.fridges.some((f) => f.id === fridgeId);
    console.log(alreadyAdded, fridge);
    if (!alreadyAdded) {
      team.fridges.push(fridge);
      await this.teamRepository.save(team);
    }

    try {
      for (const user of team.users) {
        let users = await this.userRepository.findOne({ where: { id: user.id }, relations: ['fridges'] });

        if (!users || !Array.isArray(users.fridges)) {
          console.error(`User with id ${user.id} not found or user.fridges is not an array`);
          throw new BadRequestException('User not found');
        }
        
        if (!users.fridges.some((f) => f.id === fridgeId)){
          let updatedFridge = await this.fridgeRepository.findOne({ where: { id: fridgeId }, relations: ['users'] });
          updatedFridge.users.push(users);
          await this.fridgeRepository.save(updatedFridge);
          users.fridges.push(updatedFridge);
          await this.userRepository.save(users);
          console.log('tt');
          // console.log(updatedFridge , '\n \n', users);
        }
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('error adding fridge to team user');
    }
    return team;
  }

  async patchTeam(tag: string, team: PatchTeamDto): Promise<team_entity[]> {
    const teamToUpdate = await this.teamRepository.find({
      where: { tag },
    });
    for (const a of teamToUpdate) {
      a.title = team?.title;
      a.tag = team?.tag;
      a.description = team?.description;
    }
    return await this.teamRepository.save(teamToUpdate);
  }

  async patchOneTeam(id: string, team: PatchTeamDto): Promise<team_entity> {
    const teamToUpdate = await this.teamRepository.findOne({
      where: { id },
    });
    teamToUpdate.title = team?.title;
    teamToUpdate.tag = team?.tag;
    teamToUpdate.description = team?.description;
    return await this.teamRepository.save(teamToUpdate);
  }

  async deleteTeam(tag: string): Promise<team_entity[]> {
    const teamToDelete = await this.teamRepository.find({
      where: { tag },
    });
    for (const a of teamToDelete) {
      await this.teamRepository.remove(a);
    }
    return teamToDelete;
  }

  async deleteOneTeam(id: string): Promise<team_entity> {
    const teamToDelete = await this.teamRepository.findOne({
      where: { id },
    });
    return await this.teamRepository.remove(teamToDelete);
  }

  async joinTeam(teamId: string, user: any): Promise<team_entity> {
    const userSubscribed = await this.userRepository.findOne({
      where: { id: user.user.sub },
    });

    if (userSubscribed.isSubcribed == false) {
      throw new BadRequestException('User not subscribed');
    }

    const teamToJoin = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['users', 'fridges'],
    });

    if (!teamToJoin) {
      throw new BadRequestException('Team not found');
    }
    const isUserInTeam = teamToJoin.users.find(
      (user) => user.id === userSubscribed.id,
    );
    if (isUserInTeam) {
      throw new BadRequestException('User is already in the team');
    }

    teamToJoin.users.push(userSubscribed);

    const updatedTeam = await this.teamRepository.save(teamToJoin);

    try {
      await Promise.all(teamToJoin.fridges.map(async (fridge) => {
        let updatedFridge = await this.fridgeRepository.findOne({ where: { id: fridge.id }, relations: ['users'] });
        updatedFridge.users.push(userSubscribed);
        await this.fridgeRepository.save(updatedFridge);
        let users = await this.userRepository.findOne({ where: { id: userSubscribed.id }, relations: ['fridges'] });
        users.fridges.push(updatedFridge);
        await this.userRepository.save(users);
        console.log(updatedFridge);
      }));
    }
    catch (error) {
      console.log(error);
    }

    return updatedTeam;
  }

  async leaveTeam(title: string, user: user_entity): Promise<team_entity> {
    const team = await this.teamRepository.findOne({
      where: { id: title },
      relations: ['users', 'fridges'],
    });
    if (!team) {
      throw new BadRequestException('Team not found');
    }
    const userInTeam = team.users.find((u) => u.id === user.id);

    team.users.splice(team.users.indexOf(userInTeam), 1);

    try {
      team.fridges.forEach(async (fridge) => {
        let updatedFridge = await this.fridgeRepository.findOne({ where: { id: fridge.id }, relations: ['users'] });
        updatedFridge.users.splice(updatedFridge.users.indexOf(userInTeam), 1);
        this.fridgeRepository.save(updatedFridge);
        let users = await this.userRepository.findOne({ where: { id: user.id }, relations: ['fridges'] });
        users.fridges.splice(users.fridges.indexOf(fridge), 1);
        this.userRepository.save(users);
        console.log(updatedFridge);
      });
    } catch (error) {
      console.log(error);
    }
    return await this.teamRepository.save(team);
  }
}
