import { Injectable, NotFoundException, Redirect, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'
import { EventInterface } from 'src/interface/event.interface';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventSchema } from 'src/schema/event.schema';

import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EventService {
    constructor(@InjectModel('Event') private eventModel:Model<EventInterface>, private mailService: MailerService){}
  
    async sendMail() {
       
        var response = await this.mailService.sendMail({
            to:"mrdrms06@gmail.com",
            from:"emredurmus06@hotmail.com",
            subject: 'Plain Text Email ✔',
            text: 'Winmeet mailer', 
           });
           return response;
    }
    //creating event
    async createEvent(createEventDto:CreateEventDto):Promise<EventInterface>{
        const newEvent = await new this.eventModel(createEventDto)
        createEventDto.eventStartDate = new Date(createEventDto.eventStartDate);
        createEventDto.eventEndDate = new Date(createEventDto.eventEndDate);
        this.sendMail();
        return newEvent.save();
        
   
    }

    //read all events
    async getAllEvents():Promise<EventInterface[]>{
        const eventData = await this.eventModel.find()
        if(!eventData || eventData.length == 0){
            throw new NotFoundException("Event data not found")
        }
        return eventData
    }

    //search event by id
    async findByid(eventId:string):Promise<EventInterface>{
        const existingEvent = await this.eventModel.findById(eventId)
        if(!existingEvent){
            throw new NotFoundException("Event not found")
        }
        return existingEvent
    }

    //delete event by id
    async deleteEvent(eventId:string):Promise<EventInterface>{
        const deletedEvent = await this.eventModel.findByIdAndDelete(eventId)
        if(!deletedEvent){
            throw new NotFoundException("Event not found")
        }

        return deletedEvent
    }

    //update event by id
    async updateEvent(eventId:string,updateData:UpdateEventDto):Promise<EventInterface>{
        const existingEvent = await this.eventModel.findByIdAndUpdate(eventId,updateData,{new: true})
        if(!existingEvent){
            throw new NotFoundException("Event not found")
        }

        return existingEvent
    }
}
