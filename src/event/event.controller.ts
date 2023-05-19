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

@Controller('createMeeting')
export class EventController {
  constructor(private readonly eventService: EventService) {
    this.eventService = eventService;
  }

  // @Post('/sendMail')
  // async sendMailEvent(@Body() body: any) {
  //   const { participants, superHero } = body;
  //   await this.eventService.sendMail(participants, superHero);
  // }
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
      return response.status(HttpStatus.ACCEPTED).json({
        message: 'Event has been successfully updated',
        existingEvent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Put('removeParticipant/:id')
  async removeParticipant(
    @Res() response,
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      const existingEvent = await this.eventService.removeParticipant(
        eventId,
        updateEventDto,
      );
      console.log(existingEvent);

      return response.status(HttpStatus.OK).json({
        message: 'Event has been successfully updated',
        existingEvent,
      });
    } catch (err) {
      console.log(err);
      return response.status(HttpStatus.BAD_REQUEST).json(err.response);
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
      console.log(deletedEvent);

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
