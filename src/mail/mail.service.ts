import {
  Injectable,
  Get,
  Post,
  Query,
  Body,
  Res,
  ConsoleLogger,
  NotFoundException,
} from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../user/user.service';
import { token_entity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { SendMailDto } from './dto/send-mail.dto';
import { Public } from 'src/shared/public.decorator';
import { log } from 'console';
import { readFileSync } from 'fs';
import { join } from 'path';
import { user_entity } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(user_entity)
    private readonly userRepository: Repository<user_entity>,
    private readonly userService: UsersService,
    @InjectRepository(token_entity)
    private readonly tokenRepository: Repository<token_entity>,
  ) {}

  async sendEmail(SendMailDto: any) {
    if (
      !SendMailDto.to ||
      !SendMailDto.subject ||
      !SendMailDto.text ||
      !SendMailDto.html
    ) {
      throw new Error('Missing parameters');
    }
    try {
      this.mailerService.sendMail({
        to: SendMailDto.to,
        from: process.env.EMAIL_NOREPLY,
        subject: SendMailDto.subject,
        text: SendMailDto.text,
        html: SendMailDto.html,
      });
      return 'Email sent successfully';
    } catch (err) {
      throw new Error('Error sending email');
    }
  }

  async createToken(
    uuid: string,
    link: string,
    f: string,
    name: string,
    date: Date,
  ) {
    try {
      const token = await this.tokenRepository.findOne({
        where: { uuid, name },
      });
      if (token) {
        await this.tokenRepository.delete({ uuid, name });
      }
      const newToken = new token_entity();
      newToken.token = crypto.randomBytes(20).toString('hex');
      newToken.uuid = uuid;
      newToken.name = name;
      newToken.f = f;
      newToken.link = link + newToken.token + '&token_name=' + name;
      newToken.expirationDate = date;
      await this.tokenRepository.save(newToken);
      return {
        token: newToken.token,
        expirationDate: newToken.expirationDate,
        name: newToken.name,
        f: newToken.f,
        uuid: newToken.uuid,
        link: newToken.link,
      };
    } catch (err) {
      throw new Error('Error creating token');
    }
  }

  async sendResetPasswordEmail(@Body('mail') mail: string) {
    try {
      const getUser = await this.userService.getOneUserEmail(mail);
      const getToken = await this.createToken(
        getUser.id,
        'http://api.patzenhoffer.eu/reset-password?token=',
        'resetPassword',
        'reset_token',
        new Date(Date.now() + 3600000),
      );
      let htmlContent = readFileSync(
        join(process.cwd(), 'src/mail/template/', 'resetpwd.html'),
        'utf8',
      );
      const link = `http://patzenhoffer.eu/resetpasswordpage?token=${getToken.token}&token_name=${getToken.name}`;
      htmlContent = htmlContent.replace(
        '<a href="patzenhoffer.eu" class="buttonswag">Reset</a>',
        `<a href="${link}" class="buttonswag">Reset</a>`,
      );
      await this.sendEmail({
        to: mail,
        subject: 'Réinitialisation de mot de passe',
        text: `Bonjour ${getUser.username} , veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe: ${link}`,
        html: htmlContent,
      });
      return {
        mail: mail,
        token_name: getToken.name,
        token: getToken.token,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async sendVerifyEmail(@Body('mail') mail: string) {
    try {
      const getUser = await this.userService.getOneUserEmail(mail);
      console.log(getUser);
      const getToken = await this.createToken(
        getUser.id,
        'http://localhost:3001/mail/verify-mail?token=',
        'verifyUser',
        'verify_token',
        new Date(Date.now() + 3600000),
      );
      let htmlContent = readFileSync(
        join(process.cwd(), 'src/mail/template/', 'confirmaccount.html'),
        'utf8',
      );
      const link = `https://patzenhoffer.eu/verifypage?token=${getToken.token}&token_name=${getToken.name}`;
      htmlContent = htmlContent.replace(
        '<a href="patzenhoffer.eu" class="buttonswag">Confirmer mon compte</a>',
        `<a href="${link}" class="buttonswag">Confirmer mon compte</a>`,
      );
      await this.sendEmail({
        to: mail,
        subject: 'Vérification de votre adresse email',
        text: `Bonjour ${getUser.username} , veuillez cliquer sur
            le lien ci-dessous pour vérifier votre adresse email: ${link}`,
        html: htmlContent,
      });
      return {
        mail: mail,
        token_name: getToken.name,
        token: getToken.token,
      };
    } catch (err) {
      throw new Error('Error sending email');
    }
  }

  async verify(token: string, token_name: string): Promise<string> {
    try {
      const uuid = await this.tokenRepository.findOne({ where: { token } });
      if (uuid.token) {
        return this[uuid.f](uuid.token, token_name);
      }
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  async verifyUser(token: string, token_name: string) {
    try {
      const uuid = await this.tokenRepository.findOne({
        where: { token, name: token_name },
      });
      const userToUpdate = await this.userRepository.findOne({
        where: { id: uuid.uuid },
      });
      if (!userToUpdate) {
        throw new NotFoundException(
          `user not found with token : ${uuid.uuid}`,
        );
      }
      if (userToUpdate.verified === true) {
        return { message: 'Votre compte a déjà été vérifié'};
      }
      userToUpdate.verified = true;
      await this.tokenRepository.delete({ token, name: token_name });
      await this.userRepository.save(userToUpdate);
      return { message: 'Votre compte a été vérifié avec succès' };
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  async resetPassword(token: string, token_name: string) {
    try {
      const token_u = await this.tokenRepository.findOne({
        where: { token, name: token_name },
      });
      await this.tokenRepository.delete({ token, name: token_name });
      return token_u;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
