import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Injectable, Post, Query } from '@nestjs/common';

@Controller('email')
export class EmailController {
  constructor(private mailService: MailerService) {}

  @Get('send_mail')
  async plainTextEmail(@Query('toemail') toEmail) {
    var response = await this.mailService.sendMail({
      to: toEmail,
      from: 'emredurmus06@hotmail.com',
      subject: 'Plain Text Email ✔',
      text: 'Winmeet mailer',
    });
    return response;
  }
}
