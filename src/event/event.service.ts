import { Injectable, NotFoundException, Redirect, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventInterface } from 'src/interface/event.interface';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventSchema } from 'src/schema/event.schema';
import * as moment from 'moment';

import { MailerService } from '@nestjs-modules/mailer';

const schedule = require('node-schedule');

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private eventModel: Model<EventInterface>,
    private mailService: MailerService,
  ) {}

  async sendMail(participants: string[], dto: any, templateName: string) {
    for (var i = 0; i < participants.length; i++) {
      await this.mailService.sendMail({
        to: participants[i],
        from: 'xyz@hotmail.com',
        subject: 'WinMeet Meeting Update',
        template: templateName,
        context: {
          superhero: dto,
        },
      });
    }
  }
  //creating event
  async createEvent(createEventDto: CreateEventDto): Promise<EventInterface> {
    const newEvent = await new this.eventModel(createEventDto);

    if (newEvent.eventEndDate2 == null && newEvent.eventEndDate3 == null) {
      newEvent.isPending = false;
    }
    console.log('Event id', newEvent.id);

    this.sendMail(createEventDto.participants, createEventDto, 'invitation');

    var job = schedule.scheduleJob(newEvent.eventVoteDuration, async () => {
      if (newEvent.isPending) {
        const result = await this.finalizeMeetingDate(newEvent.id);
        const participantsAndOwner = [
          ...result.participants,
          result.eventOwner,
        ];
        this.sendMail(participantsAndOwner, result, 'scheduled');
      }
    });

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
    if (result.participants.length === result.voters.length) {
      const response = await this.finalizeMeetingDate(result.id);
      const participantsAndOwner = [
        ...response.participants,
        response.eventOwner,
      ];
      this.sendMail(participantsAndOwner, response, 'scheduled');
      return response;
    } else {
      return result;
    }
  }

  //delete event by id
  async deleteEvent(eventId: string): Promise<EventInterface> {
    const deletedEvent = await this.eventModel
      .findByIdAndDelete(eventId)
      .lean();
    if (!deletedEvent) {
      throw new NotFoundException('Event not found');
    }
    console.log('participants' + deletedEvent.participants);
    this.sendMail(deletedEvent.participants, deletedEvent, 'delete');

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
    const event = await this.eventModel.findById(eventId);

    let uniqueNewParticipants = updateData.participants.filter(
      (participant) => !event.participants.includes(participant),
    );
    console.log(uniqueNewParticipants);

    updateData.participants = [...event.participants, ...uniqueNewParticipants];

    const existingEvent = await this.eventModel
      .findByIdAndUpdate(eventId, updateData, { new: true })
      .lean();

    this.sendMail(uniqueNewParticipants, existingEvent, 'invitation');

    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    return existingEvent;
  }

  async removeParticipant(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<any> {
    const event = await this.eventModel.findById(eventId).lean();
    const result = event.participants.filter(
      (item) => !updateEventDto.participants.includes(item),
    );
    await this.eventModel.findByIdAndUpdate(eventId, {
      participants: result,
    });
    event.participants = updateEventDto.participants;
    await this.sendMail([event.eventOwner], event, 'notice_owner');

    return event;
  }

  async finalizeMeetingDate(eventId) {
    const event = await this.eventModel.findById(eventId);
    const votes = [event.eventVote1, event.eventVote2, event.eventVote3];
    const max = Math.max(...votes);
    const maxIndex = votes.indexOf(max);
    switch (maxIndex) {
      case 1:
        event.eventStartDate = event.eventStartDate2;
        event.eventEndDate = event.eventEndDate2;
        break;
      case 2:
        event.eventStartDate = event.eventStartDate3;
        event.eventEndDate = event.eventEndDate3;
        break;
    }
    const result = await this.eventModel
      .findByIdAndUpdate(
        eventId,
        {
          isPending: false,
          eventStartDate: event.eventStartDate,
          eventEndDate: event.eventEndDate,
          eventStartDate2: null,
          eventEndDate2: null,
          eventStartDate3: null,
          eventEndDate3: null,
        },
        { new: true },
      )
      .lean();
    result.stringEventStartDate = this.formatDate(result.eventStartDate);
    result.stringEventEndDate = this.formatDate(result.eventEndDate);
    return result;
  }
  formatDate(date: Date): string {
    const formattedDate = moment(date)
      .utcOffset('+03:00')
      .format('ddd MMM D YYYY HH:mm [UTC]Z');
    return formattedDate.replace('GMT', 'UTC');
  }
}
