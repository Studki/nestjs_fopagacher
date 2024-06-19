import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { createTeam, PatchTeamDto } from './dto/index';
import { team_entity } from './entities/team.entity';
import { user_entity } from '../user/entities/user.entity';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AddFridgeDto } from './dto/add-fridge.dto';

@Controller('teams')
@ApiTags('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Find all teams' })
  @ApiResponse({ status: 200, description: 'JSON array of all teams.' })
  @ApiResponse({ status: 404, description: 'No teams found.' })
  async getAllTeams(): Promise<team_entity[]> {
    try {
      const teams = await this.teamService.getAllTeams();
      if (!teams) {
        throw new NotFoundException('No teams found');
      }
      return teams;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get users in a team' })
  @ApiResponse({ status: 200, description: 'JSON array of users in the team.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  async getTeamUsers(@Param('id') id: string): Promise<user_entity[]> {
    try {
      const team = await this.teamService.getTeamWithUsers(id);
      console.log(team);
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      return team.users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/fridges')
  @ApiOperation({ summary: 'Add a fridge to a team' })
  @ApiResponse({ status: 200, description: 'JSON array of all teams.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  async addFridgeToTeam(
    @Param('id') id: string,
    @Body() addFridgeDto: AddFridgeDto,
  ): Promise<team_entity> {
    try {
      const team = await this.teamService.addFridgeToTeam(
        id,
        addFridgeDto.fridgeId,
      );
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      return team;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Find a team by id or tag' })
  @ApiResponse({ status: 200, description: 'JSON object of the team.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  async getOneTeam(
    @Param('identifier') identifier: string,
  ): Promise<team_entity | team_entity[]> {
    try {
      const team = await this.teamService.getTeam(identifier);
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      return team;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({ status: 201, description: 'JSON object of the created team.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createTeam(
    @Body() team: createTeam,
    @Req() request,
  ): Promise<team_entity> {
    try {
      const userId = request.user.sub;

      const newTeam = await this.teamService.createTeam(team, userId);
      if (!newTeam) {
        throw new NotFoundException('Team not created');
      }
      return newTeam;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':identifier')
  @ApiOperation({ summary: 'Replace a team' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the replaced team.',
  })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  async patchTeam(
    @Param('identifier') identifier: string,
    @Body() team: PatchTeamDto,
  ): Promise<team_entity | team_entity[]> {
    try {
      const newTeam = await this.teamService.patchTeam(identifier, team);
      if (!newTeam) {
        throw new NotFoundException('Team not replaced');
      }
      return newTeam;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':identifier')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({ status: 200, description: 'JSON array of all teams.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  async deleteTeam(
    @Param('identifier') identifier: string,
  ): Promise<team_entity | team_entity[]> {
    try {
      const teams = await this.teamService.deleteTeam(identifier);
      if (!teams) {
        throw new NotFoundException('Team not deleted');
      }
      return teams;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('joinTeam/:id')
  @ApiOperation({ summary: 'Join a team' })
  @ApiResponse({ status: 200, description: 'JSON array of all teams.' })
  @ApiResponse({ status: 404, description: "Can't join a team." })
  async joinTeam(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<team_entity> {
    try {
      const joinTeam = await this.teamService.joinTeam(id, request);
      if (!joinTeam) {
        throw new NotFoundException("Can't join a Team");
      }
      return joinTeam;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Delete('leaveTeam/:id')
  @ApiOperation({ summary: 'Leave a team' })
  @ApiResponse({ status: 200, description: 'JSON array of all teams.' })
  @ApiResponse({ status: 404, description: "Can't leave a team." })
  async leaveTeam(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<team_entity> {
    try {
      const user = request['user'];
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const leaveTeam = await this.teamService.leaveTeam(id, user);
      if (!leaveTeam) {
        throw new NotFoundException("Can't leave a Team");
      }
      return leaveTeam;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
