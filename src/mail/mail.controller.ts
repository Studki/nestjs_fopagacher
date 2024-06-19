import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { Console } from 'console';
import { Public } from 'src/shared/public.decorator';

@Controller('mail')
@ApiTags('mail')
@Public()
export class MailController {
  constructor(private readonly MailService: MailService) {}

  @Post()
  @ApiOperation({ summary: 'Send personalized mail' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'to', required: true })
  @ApiParam({ name: 'subject', required: true })
  @ApiParam({ name: 'body', required: true })
  @ApiParam({ name: 'text', required: true })
  @ApiParam({ name: 'html', required: true })
  async sendEmail(SendMailDto: any) {
    try {
      if (
        !SendMailDto.to ||
        !SendMailDto.subject ||
        !SendMailDto.text ||
        !SendMailDto.html
      ) {
        throw new BadRequestException('Missing parameters');
      }
      this.MailService.sendEmail(SendMailDto);
      return 'Email sent successfully';
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch('token')
  @ApiOperation({ summary: 'Verify token and redirect to the wanted function' })
  @ApiResponse({ status: 200, description: 'Token verified' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'token', required: true })
  @ApiParam({ name: 'token_name', required: true })
  async verifyToken(
    @Body('token') token: string,
    @Body('token_name') token_name: string,
  ) {
    try {
      return await this.MailService.verify(token, token_name);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Public()
  @Post('send-reset-password-email')
  @ApiOperation({ summary: 'Send reset password mail' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'mail', required: true })
  async sendResetPasswordEmail(@Body('mail') mail: string) {
    try {
      return await this.MailService.sendResetPasswordEmail(mail);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Public()
  @Post('verify-mail')
  @ApiOperation({ summary: 'Send verification mail' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiParam({ name: 'mail', required: true })
  async sendVerificationMail(@Body('mail') mail: string) {
    try {
      return await this.MailService.sendVerifyEmail(mail);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}