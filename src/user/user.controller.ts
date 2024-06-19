import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  Patch,
  UnauthorizedException,
  Req,
  Res,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { createUser, PatchUserDto } from './dto/index';
import { user_entity } from './entities/user.entity';
import { GetUserTagsDto } from './dto/get-user-tags.dto';
import { addTagToUserDto } from './dto/add-tag-to-user.dto';
import { getUser } from './dto/index';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/shared/public.decorator';
import { Roles } from 'src/shared/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { tag_entity } from 'src/tag/entities/tag.entity';
import { AddRecipeToUserDto } from './dto/add-recipe-to-user.dto';
import { FavoriteRecipeDto } from './dto/add-fav-recipe-to-user.dto';
import { AddUstensilesDto } from './dto/add-ustensile-to-user.dto';
import { MailService } from 'src/mail/mail.service';
import { AddDietDto } from './dto/add-diet-to-user.dto';
import { PatchUserAllergy } from './dto/patch-user-allergy.dto';
import { recipe_entity } from 'src/recipe/entities/recipe.entity';
import { DeleteUserAllergy } from './dto/delete-allergy-from-user.dto';
import { allergy_entity } from 'src/allergy/entities/allergy.entity';
import { DeleteUserDiet } from './dto/delete-diet-user.dto';
import { OauthDto } from './dto/oauth.login.dto';
import { Response } from 'express';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private mailService: MailService,
  ) {}

  @Public()
  @Get('deeplink')
  async handleDeepLinking(@Query('path') path: string) {
    return path;
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'json of the new user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createUser(@Body() user: createUser): Promise<{
    access_token: string;
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    image: string;
    notif_user: boolean;
    notif_news: boolean;
    notif_commercial: boolean;
    notif_recipe: boolean;
    email_recipe: boolean;
    email_news: boolean;
    email_commercial: boolean;
  }> {
    try {
      const {
        access_token,
        id,
        email,
        username,
        firstname,
        lastname,
        image,
        notif_user,
        notif_news,
        notif_commercial,
        notif_recipe,
        email_recipe,
        email_news,
        email_commercial,
      } = await this.usersService.createUser(user);
      if (!access_token) {
        throw new UnauthorizedException('User not found');
      }
      this.mailService.sendVerifyEmail(user.email);
      return Promise.resolve({
        access_token,
        id,
        email,
        username,
        firstname,
        lastname,
        image,
        notif_user,
        notif_news,
        notif_commercial,
        notif_recipe,
        email_recipe,
        email_news,
        email_commercial,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('favoriterecipes')
  @ApiOperation({ summary: 'Delete a favorite recipe from a user' })
  @ApiResponse({ status: 200, description: 'JSON object of the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'recipeName', required: true })
  async deleteFavoriteRecipe(
    @Req() request: Request,
    @Body() favoriteRecipeDto: FavoriteRecipeDto,
  ) {
    return this.usersService.deleteUserFavoriteRecipe(
      request,
      favoriteRecipeDto,
    );
  }

  @Get('recoRecette')
  @ApiOperation({
    summary: 'get recipes with at least 3 ingredients in your fridge',
  })
  @ApiResponse({ status: 200, description: 'array of the recomanded recipes' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async findRecipesWithAtLeastThreeIngredients(
    @Req() request: Request,
  ): Promise<recipe_entity[]> {
    return this.usersService.getRecipesMatchingFridgeContents(request);
  }

  @Get('allergy')
  @ApiOperation({ summary: 'Get user allergies' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the user allergies',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserAllergies(@Req() request: Request): Promise<allergy_entity[]> {
    try {
      return this.usersService.getUserAllergies(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('allergy')
  @ApiOperation({ summary: 'delete allergy from user' })
  @ApiResponse({ status: 200, description: 'json of the updated user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async deleteAllergyFromUser(
    @Body() deleteUserAllergy: DeleteUserAllergy,
    @Req() request: Request,
  ) {
    try {
      return this.usersService.deleteAllergiesForUser(
        request,
        deleteUserAllergy.allergiesToDelete,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('allergy')
  @ApiOperation({ summary: 'add allergy to user' })
  @ApiResponse({ status: 200, description: 'json of the updated user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addAllergyToUser(
    @Body() patchUserAllergy: PatchUserAllergy,
    @Req() request: Request,
  ) {
    try {
      return this.usersService.updateAllergiesForUser(
        request,
        patchUserAllergy.allergiesToAdd,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Patch('/reset-password')
  @ApiOperation({ summary: 'reset a user password' })
  @ApiResponse({ status: 200, description: 'JSON object of the updated user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'token', required: true })
  @ApiParam({ name: 'password', required: true })
  resetUserPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ): Promise<user_entity> {
    try {
      const updatedUser = this.usersService.resetUserPassword(token, password);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /*@Public()
  @Patch('/:id/notification')
  @ApiOperation({ summary: 'reset a user password' })
  @ApiResponse({ status: 200, description: 'JSON object of the updated user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'token', required: true })
  resetUserPassword(
    @Body('token') token: string,
    @Body() notificationUserDto: NotificationUserDto,
  ): Promise<user_entity> {
    try {
      const updatedUser = this.usersService.updateNotificationForUser(token, notificationUserDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }*/

  // @Public()
  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'JSON array of all users.' })
  @ApiResponse({ status: 404, description: 'No users found.' })
  getAllUsers(): Promise<getUser[]> {
    try {
      const users = this.usersService.getAllUsers();
      if (!users) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'JSON object of the updated user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'id', required: true })
  async updateUser(
    @Param('id') id: string,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<user_entity> {
    try {
      const updatedUser = this.usersService.updateUser(id, patchUserDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post('isUsernameTaken')
  @ApiOperation({ summary: 'Check if a username is already taken' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the username',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async isUsernameTaken(@Body('username') username: string): Promise<boolean> {
    return this.usersService.isUsernameTaken(username);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get user tags' })
  @ApiResponse({ status: 200, description: 'JSON object of the user tags.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserTags(@Req() request: Request): Promise<string[]> {
    try {
      return this.usersService.getUserTagsByUserId(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('favoriterecipes')
  @ApiOperation({ summary: 'Get user favorite recipes' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the user favorite recipes.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserFavoriteRecipes(@Req() request: Request) {
    try {
      return this.usersService.getUserFavoriteRecipes(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('diet')
  @ApiOperation({ summary: 'Get user diet' })
  @ApiResponse({ status: 200, description: 'JSON object of the user diet.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserDiet(@Req() request: Request) {
    try {
      return this.usersService.getUserDiets(request);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('diet')
  @ApiOperation({ summary: 'Delete user diet' })
  @ApiResponse({ status: 200, description: 'JSON object of the user diet.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async deleteUserDiet(
    @Req() request: Request,
    @Body() deleteDietUserDto: DeleteUserDiet,
  ) {
    try {
      return this.usersService.deleteUserDiet(
        request,
        deleteDietUserDto.dietsToDelete,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('diet')
  @ApiOperation({ summary: 'Add a diet to a user' })
  @ApiResponse({ status: 200, description: 'JSON object of the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'dietName', required: true })
  async addDietToUser(@Req() request: Request, @Body() addDietDto: AddDietDto) {
    try {
      return this.usersService.addDietToUser(request, addDietDto.dietNames);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('ustensiles')
  @ApiOperation({ summary: 'Add a ustensile to a user' })
  @ApiResponse({ status: 200, description: 'JSON object of the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'userId', required: true })
  @ApiParam({ name: 'ustensileName', required: true })
  async addUstensilesToUser(
    @Req() request: Request,
    @Body() addUstensilesDto: AddUstensilesDto,
  ) {
    try {
      return this.usersService.addUserUstensiles(request, addUstensilesDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('ustensiles')
  @ApiOperation({ summary: 'Get user ustensiles' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the user ustensiles.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserUstensiles(@Req() request: Request) {
    return this.usersService.getUserUstensiles(request);
  }

  @Delete('ustensiles')
  @ApiOperation({ summary: 'Delete user ustensiles' })
  @ApiResponse({
    status: 200,
    description: 'JSON object of the user ustensiles.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async deleteUserUstensiles(
    @Req() request: Request,
    @Body() addUstensilesDto: AddUstensilesDto,
  ) {
    return this.usersService.deleteUserUstensile(request, addUstensilesDto);
  }

  @Post('recipes')
  @ApiOperation({ summary: 'Add a recipe to a user' })
  @ApiResponse({ status: 200, description: 'JSON object of the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'recipeName', required: true })
  async addRecipeToUser(
    @Req() request: Request,
    @Body() addRecipeToUserDto: AddRecipeToUserDto,
  ) {
    return this.usersService.addRecipeToUser(request, addRecipeToUserDto);
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getOneUser(@Param('identifier') identifier: string): Promise<user_entity> {
    try {
      const user = this.usersService.getOneUser(identifier);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':identifier')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the deleted user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  deleteUser(@Param('identifier') identifier: string) {
    try {
      const user = this.usersService.deleteOneUser(identifier);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin)
  @Delete('/are/you/sure/you/want/to/delete/all/users/yes')
  @ApiOperation({ summary: 'Delete all users' })
  @ApiResponse({ status: 200, description: 'JSON array of all deleted users.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  deleteAllUsers(): Promise<user_entity[]> {
    try {
      const users = this.usersService.deleteAllUsers();
      if (!users) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/password/:identifier')
  @ApiOperation({ summary: 'Update a user password' })
  @ApiResponse({ status: 200, description: 'JSON object of the updated user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'identifier', required: true })
  @ApiParam({ name: 'password', required: true })
  patchUserPassword(
    @Param('identifier') identifier: string,
    @Body('password') password: string,
  ): Promise<user_entity> {
    try {
      const updatedUser = this.usersService.updateUserPassword(
        identifier,
        password,
      );
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/tags')
  @ApiOperation({ summary: 'Add user tags' })
  @ApiResponse({ status: 200, description: 'JSON object of the user tags.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'tags', required: true })
  async addTagToUser(
    @Param('id') userId: string,
    @Body() addTagToUserDto: addTagToUserDto,
  ): Promise<user_entity> {
    return this.usersService.addTagToUser(userId, addTagToUserDto);
  }

  @Get(':userId/tags/:tagId')
  @ApiOperation({ summary: 'Get user tag by id' })
  @ApiResponse({ status: 200, description: 'JSON object of the user tag.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'userId', required: true })
  @ApiParam({ name: 'tagId', required: true })
  async getUserTagById(
    @Param('userId') userId: string,
    @Param('tagId') tagId: string,
  ): Promise<tag_entity> {
    return this.usersService.getUserTagById(userId, tagId);
  }

  @Public()
  @Post('/auth')
  @ApiOperation({ summary: 'Login a user via oauth' })
  @ApiResponse({ status: 200, description: 'json of the logged in user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async oauthUser(@Body() oauthDto: OauthDto, @Res() res: Response) {
    const {
      access_token,
      id,
      email,
      verified,
      username,
      firstname,
      lastname,
      image,
      fcmToken,
      isOauth,
      created,
      notif_user,
      notif_news,
      notif_commercial,
      notif_recipe,
      email_commercial,
      email_recipe,
      email_news,
    } = await this.usersService.loginOauth(oauthDto);

    if (created) {
      return res.status(HttpStatus.CREATED).json({
        access_token,
        id,
        email,
        verified,
        username,
        firstname,
        lastname,
        image,
        fcmToken,
        isOauth,
        notif_user,
        notif_news,
        notif_commercial,
        notif_recipe,
        email_commercial,
        email_recipe,
        email_news,
      });
    } else if (!created) {
      this.mailService.sendVerifyEmail(email);
      return res.status(HttpStatus.OK).json({
        access_token,
        id,
        email,
        verified,
        username,
        firstname,
        lastname,
        image,
        fcmToken,
        isOauth,
        notif_user,
        notif_news,
        notif_commercial,
        notif_recipe,
        email_commercial,
        email_recipe,
        email_news,
      });
    }
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'json of the logged in user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'email', required: true })
  @ApiParam({ name: 'password', required: true })
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{
    access_token: string;
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    image: string;
    fcmToken: string;
    isOauth: boolean;
    notif_user: boolean;
    notif_news: boolean;
    notif_commercial: boolean;
    notif_recipe: boolean;
    email_news: boolean;
    email_commercial: boolean;
    email_recipe: boolean;
  }> {
    try {
      const {
        access_token,
        id,
        email: userEmail,
        username,
        firstname,
        lastname,
        image,
        fcmToken,
        isOauth,
        notif_user,
        notif_news,
        notif_commercial,
        notif_recipe,
        email_commercial,
        email_recipe,
        email_news,
      } = await this.usersService.loginUser(email, password);

      if (!access_token) {
        throw new UnauthorizedException('User not found');
      }

      return Promise.resolve({
        access_token,
        id,
        email,
        username,
        firstname,
        lastname,
        image,
        fcmToken,
        isOauth,
        notif_user,
        notif_news,
        notif_commercial,
        notif_recipe,
        email_news,
        email_commercial,
        email_recipe,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':userId/recipes')
  @ApiOperation({ summary: 'Get user recipes' })
  @ApiResponse({ status: 200, description: 'JSON object of the user recipes.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'userId', required: true })
  async getUserRecipes(@Param('userId') userId: string) {
    return this.usersService.getUserRecipes(userId);
  }

  @Post('favoriterecipes')
  @ApiOperation({ summary: 'Add a favorite recipe to a user' })
  @ApiResponse({ status: 200, description: 'JSON object of the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'recipeName', required: true })
  async favoriteRecipe(
    @Req() request: Request,
    @Body() favoriteRecipeDto: FavoriteRecipeDto,
  ) {
    return this.usersService.favoriteRecipeByName(request, favoriteRecipeDto);
  }

  // @Admin()
  @Patch(':id/subscription')
  @ApiOperation({ summary: 'Update user subscription status' })
  @ApiResponse({ status: 200, description: 'JSON object of the updated user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async patchUserSubscription(
    @Param('id') id: string,
    @Body('isSubscribed') isSubscribed: boolean,
  ): Promise<user_entity> {
    try {
      const updatedUser = await this.usersService.patchUserSubscription(
        id,
        isSubscribed,
      );
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
