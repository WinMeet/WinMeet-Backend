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
    MongooseModule.forRoot('mongodb+srv://admin:muzumsu@cluster0.t49jrqs.mongodb.net/test', {dbname:'WinMeetDB'}),
    MongooseModule.forFeature([{name:'Event',schema:EventSchema}]),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'cemo99@gmail.com',
          pass: 'jbkynthdjhzbfolt',
        },
      }
    }),
  ],
   
    

  controllers: [AppController, EventController, EmailController],
  providers: [AppService, EventService],
})
export class AppModule {}
