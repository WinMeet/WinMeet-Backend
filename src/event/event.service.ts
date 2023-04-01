import { Injectable, NotFoundException, Redirect, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventInterface } from 'src/interface/event.interface';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventSchema } from 'src/schema/event.schema';

import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private eventModel: Model<EventInterface>,
    private mailService: MailerService,
  ) {}

  async sendMail(participants: string[], superHero: any) {
    for (var i = 0; i < participants.length; i++) {
      await this.mailService.sendMail({
        to: participants[i],
        from: 'emredurmus06@hotmail.com',
        subject: 'WinMeet Template',
        template: 'superhero',
        context: {
          superHero: superHero,
        },
      });
      //return response;
    }
  }
  //creating event
  async createEvent(createEventDto: CreateEventDto): Promise<EventInterface> {
    const newEvent = await new this.eventModel(createEventDto);
    // this.sendMail(createEventDto.participants, createEventDto);
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

  //search event by id
  async findByid(eventId: string): Promise<EventInterface> {
    const existingEvent = await this.eventModel.findById(eventId);
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    return existingEvent;
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
}
