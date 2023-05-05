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

@Controller('createMeeting')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  async createEvent(@Res() response, @Body() createEventDto: CreateEventDto) {
    try {
      const newEvent = await this.eventService.createEvent(createEventDto);
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

  @Get('/all')
  async getEvents(@Res() response, @Req() request) {
    console.log(request.body.eventOwner);
    try {
      const eventData = await this.eventService.findByuserEmail(request.body.eventOwner);

      const eventPart = await this.eventService.findByparticipants(request.body.eventOwner);
      //eventData.concat(eventPart);
      const combined = [...eventData, ...eventPart]
      // const eventPart = await this.eventService.findByparticipants(eventData);
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

  /*@Get('/:id')
  async findByid(@Res() response, @Param('id') eventId: string) {
    try {
      const existingEvent = await this.eventService.findByid(eventId);
      return response.status(HttpStatus.OK).json({
        message: 'Event found successfully',
        existingEvent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }*/

  @Delete('/:id')
  async deleteEvent(@Res() response, @Param('id') eventId: string) {
    try {
      const deletedEvent = await this.eventService.deleteEvent(eventId);

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
