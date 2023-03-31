import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
//import { MongooseModule } from '@nestjs/mongoose/dist';
import { EventSchema } from './schema/event.schema';
import { EventService } from './event/event.service';
import { UserService } from './user/user.service';
import { EventController } from './event/event.controller';

//Mailer
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailController } from './email.controller';
import { UserController } from './user/user.controller';
import { UserSchema } from './schema/user.schema';
import { join } from 'path/posix';

//KeyCloak

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:muzumsu@cluster0.t49jrqs.mongodb.net/test',
      { dbname: 'WinMeetDB' },
    ),

    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    //KeyCloak
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: '',
          pass: '',
        },
      },
      template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],

  controllers: [
    AppController,
    EventController,
    EmailController,
    UserController,
  ],
  providers: [AppService, EventService, UserService],
})
export class AppModule {}
