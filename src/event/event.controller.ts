import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Put,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventService } from './event.service';
import { request } from 'http';
import { stringify } from 'querystring';
import { Db, Collection } from 'mongodb';
import { now } from 'mongoose';

const io = require('socket.io-client');
const moment = require('moment-timezone');
const socket = io('http://localhost:3002');
const schedule = require('node-schedule');

// Set the desired timezone (e.g., Istanbul)
const desiredTimezone = 'Europe/Istanbul';

// Create a new moment object with the current datetime
const currentDateTime = new Date();

/*// Convert the datetime to the desired timezone
const timezoneDateTime = currentDateTime.tz(desiredTimezone);
const formattedDateTime = timezoneDateTime.toISOString();
const dateObject = new Date(formattedDateTime);*/

var eventDtoarray = [];
var pendingDueDate = new Date();
var participants = [];
var eventService: EventService;
var eventOwner = '';

//const job = schedule.scheduleJob('*/5 * * * * *', function () {
/*console.log('The answer to life, the universe, and everything!');
    console.log(currentDateTime);
    var Superhero: any;

    if (eventDtoarray.length > 0) {
      if (currentDateTime === pendingDueDate) {
        fetch('/sendMail', {
            method: 'POST',
           
            body: JSON.stringify({
                participants: participants,
                superHero: Superhero,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
            
            })
            .catch((error) => {
              
            });
      }
    }
  });*/

@Controller('createMeeting')
export class EventController {
  constructor(private readonly eventService: EventService) {
    this.eventService = eventService;
  }

  @Post('/sendMail')
  async sendMailEvent(@Body() body: any) {
    const { participants, superHero } = body;
    await this.eventService.sendMail(participants, superHero);
  }
  @Post()
  async createEvent(@Res() response, @Body() createEventDto: CreateEventDto) {
    try {
      const newEvent = await this.eventService.createEvent(createEventDto);

      eventDtoarray = [...eventDtoarray, newEvent];
      pendingDueDate = newEvent.eventVoteDuration;
      participants = newEvent.participants;
      eventOwner = newEvent.eventOwner;

      if(!newEvent.$isEmpty){
      var startTime = new Date(newEvent.eventVoteDuration.getTime());
      var endTime = new Date(startTime.getTime() + 1000);
      var job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
      console.log('Mail sent to participants');
      this.sendMailEvent(participants, eventOwner);
});}

      return response.status(HttpStatus.CREATED).json({
        message: 'Event has been created successfully',
        newEvent,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error! Event not created.',
        error: 'Bad request!',
      });
    }
  }

  @Post('/all')
  async getEvents(@Res() response, @Req() request) {
    //console.log(request.body.eventOwner);
    try {
      const eventData = await this.eventService.findByuserEmail(
        request.body.eventOwner,
      );
      const eventPart = await this.eventService.findByparticipants(
        request.body.eventOwner,
      );

      for (const participants of eventPart) {
        for (const participant of participants.participants) {
          if (participants.voters.includes(participant)) {
            participants.isVoted = true;
          }
        }
      }

      const combined = [...eventData, ...eventPart];

      return response.status(HttpStatus.OK).json({
        message: 'All event data found successfully',
        combined,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Put('/:id')
  async updateEvent(
    @Res() response,
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      const existingEvent = await this.eventService.updateEvent(
        eventId,
        updateEventDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Event has been successfully updated',
        existingEvent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Put('/pending/:id/:voter')
  async findByIdAndUpdate(
    @Param('id') eventId: string,
    @Param('voter') voter: string,
    @Body('fieldToIncrement') fieldToIncrement: number,
    @Res() response,
  ) {
    console.log(eventId);
    try {
      const result = await this.eventService.findByIdAndUpdateVote(
        eventId,
        voter,
        fieldToIncrement,
      );
      console.log(result);
      return response.status(HttpStatus.OK).json({
        message: 'Event has been successfully updated',
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Delete('/:id')
  async deleteEvent(@Res() response, @Param('id') eventId: string) {
    try {
      const deletedEvent = await this.eventService.deleteEvent(eventId);
      // FIX CRASHES WHEN DELETE
      this.sendMailEvent(deletedEvent.participants);

      return response.status(HttpStatus.OK).json({
        message: 'Event Deleted Successfully',
        deletedEvent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/deleteAll')
  async deleteAllEvents(@Res() response) {
    try {
      const deletedAllEvents = await this.eventService.deleteAllEvents();

      console.dir(deletedAllEvents);

      return response.status(HttpStatus.OK).json({
        message: 'All Events Deleted Successfully',
        deletedAllEvents,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
