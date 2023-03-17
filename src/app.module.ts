import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule} from '@nestjs/mongoose'
import { AppService } from './app.service';
//import { MongooseModule } from '@nestjs/mongoose/dist';
import {EventSchema} from './schema/event.schema'
import { EventService } from './event/event.service';
import { EventController } from './event/event.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {dbname:'WinMeetDB'}),
    MongooseModule.forFeature([{name:'Event',schema:EventSchema}])
],
  controllers: [AppController, EventController],
  providers: [AppService, EventService],
})
export class AppModule {}
