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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://emre:123@cluster0.wqgmfoi.mongodb.net', {dbname:'WinMeetDB'}),
    MongooseModule.forFeature([{name:'Event',schema:EventSchema}]),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      }
    }),
  ],
   
    

  controllers: [AppController, EventController, EmailController],
  providers: [AppService, EventService],
})
export class AppModule {}
