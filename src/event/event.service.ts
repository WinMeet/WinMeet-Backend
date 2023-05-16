import { Injectable, NotFoundException, Redirect, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventInterface } from 'src/interface/event.interface';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventSchema } from 'src/schema/event.schema';

import { MailerService } from '@nestjs-modules/mailer';

const schedule = require('node-schedule');


@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private eventModel: Model<EventInterface>,
    private mailService: MailerService,
  ) {}

  async sendMail(participants: string[], dto: UpdateEventDto, templateName: string) {
    for (var i = 0; i < participants.length; i++) {
      await this.mailService.sendMail({
        to: participants[i],
        from: 'xyz@hotmail.com',
        subject: 'WinMeet Template',
        template: templateName,
        context: {
          superhero: dto,
        },
      });

      //return response;
    }
  }
  //creating event
  async createEvent(createEventDto: CreateEventDto): Promise<EventInterface> {
    const newEvent = await new this.eventModel(createEventDto);

    if (newEvent.eventEndDate2 == null && newEvent.eventEndDate3 == null) {
      newEvent.isPending = false;
    }

    var job = schedule.scheduleJob(newEvent.eventVoteDuration, () =>  {
      this.sendMail(createEventDto.participants, createEventDto, 'invitation');});  

    return newEvent.save();
  }

  //read all events
  async getAllEvents(): Promise<EventInterface[]> {
    const eventData = await this.eventModel.find();

    if (!eventData || eventData.length === 0) {
      return [];
    }

    return eventData;
  }

  async getPendingEvents(): Promise<EventInterface[]> {
    const eventData = await this.eventModel.find({ isPending: true });

    if (!eventData || eventData.length === 0) {
      return [];
    }

    return eventData;
  }

  //search event by id
  async findByuserEmail(eventOwn: string): Promise<EventInterface[]> {
    const existingEvent = await this.eventModel.find({ eventOwner: eventOwn });
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    return existingEvent;
  }

  async findByparticipants(eventOwn: string): Promise<EventInterface[]> {
    const existingEvent = await this.eventModel.find({
      participants: { $in: [eventOwn] },
    });
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    return existingEvent;
  }

  async findByIdAndUpdateVote(
    eventId: string,
    voterArray: string,
    fieldToIncrement: number,
  ) {
    let field;

    switch (fieldToIncrement) {
      case 0:
        field = 'eventVote1';
        break;
      case 1:
        field = 'eventVote2';
        break;
      case 2:
        field = 'eventVote3';
        break;
      default:
        throw new NotFoundException('Invalid fieldToIncrement value');
    }

    const result = await this.eventModel.findByIdAndUpdate(
      eventId,
      {
        $push: { voters: voterArray },
        $inc: { [field]: 1 },
      },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Event not found');
    }

    return result;
  }

  //delete event by id
  async deleteEvent(eventId: string): Promise<EventInterface> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      throw new NotFoundException('Event not found');
    }

    return deletedEvent;
  }

  //delete all events
  async deleteAllEvents() {
    const deletedEvents = await this.eventModel.deleteMany();
    if (!deletedEvents) {
      throw new NotFoundException('Event not found');
    }

    return deletedEvents;
  }

  //update event by id
  async updateEvent(
    eventId: string,
    updateData: UpdateEventDto,
  ): Promise<EventInterface> {
    const existingEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true },
    );
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    return existingEvent;
  }


  async removeParticipant(eventId: string, updateData: UpdateEventDto): Promise <any> {
    
    
  
    

    await this.sendMail([updateData.eventOwner], updateData, 'notice_owner');

  
    /*const eventOwner = await this.eventModel.findById(eventId).select('eventOwner');
    const eventName = await this.eventModel.findById(eventId).select('eventName');


    existingEvent.eventOwner = eventOwner?.eventOwner?.toString() || '';
    existingEvent.eventName = eventName?.eventName?.toString() || '';*/

    return updateData;
  }
  
}
