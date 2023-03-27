import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule} from '@nestjs/mongoose'
import { AppService } from './app.service';
//import { MongooseModule } from '@nestjs/mongoose/dist';
import {EventSchema} from './schema/event.schema'
import { EventService } from './event/event.service';
import { EventController } from './event/event.controller';

//Mailer
import { MailerModule} from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { join } from 'path/posix';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://emre:123@cluster0.wqgmfoi.mongodb.net', {dbname:'WinMeetDB'}),
    MongooseModule.forFeature([{name:'Event',schema:EventSchema}]),

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
   
    

  controllers: [AppController, EventController, EmailController],
  providers: [AppService, EventService],
})
export class AppModule {}
