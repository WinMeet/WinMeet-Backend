import { Controller, Post, Res, Body, HttpStatus, Get, Put, Param, Delete } from '@nestjs/common';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventService } from './event.service';

@Controller('createMeeting')
export class EventController {
    constructor(private readonly eventService:EventService){}

    @Post()
    async createEvent(@Res() response, @Body()createEventDto:CreateEventDto){
        try{
            const newEvent = await this.eventService.createEvent(createEventDto)
            return response.status(HttpStatus.CREATED).json({
                message:"Event has been created successfully",
                newEvent
            })

        }catch(err){
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode:400,
                message:"Error! Event not created.",
                error:"Bad request!"
            })
        }
    }

    @Get()
    async getEvents(@Res() response) {
        try {
            const eventData = await this.eventService.getAllEvents();
            return response.status(HttpStatus.OK).json({
                message: 'All event data found successfully', eventData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put('/:id')
    async updateEvent(@Res() response, @Param('id') eventId: string,
        @Body() updateEventDto: UpdateEventDto) {
        try {
            const existingEvent = await this.eventService.updateEvent(eventId, updateEventDto);
            return response.status(HttpStatus.OK).json({
                message: 'Event has been successfully updated',
                existingEvent,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/:id')
    async findByid(@Res() response, @Param('id') eventId: string) {
        try {
            const existingEvent = await
                this.eventService.findByid(eventId);
            return response.status(HttpStatus.OK).json({
                message: 'Event found successfully', existingEvent,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Delete('/:id')
    async deleteEvent(@Res() response,@Param('id') eventId:string){
        try{

            const deletedEvent = await this.eventService.deleteEvent(eventId)

            return response.status(HttpStatus.OK).json({
                message:"Event Deleted Successfully",
                deletedEvent
            })

        }catch(err){
            return response.status(err.status).json(err.response)
        }
    }
}
