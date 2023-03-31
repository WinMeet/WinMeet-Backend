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
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from './user.service';

@Controller('registeruser')
export class UserController {
  constructor(private readonly eventService: UserService) {}

  @Post()
  async createUser(@Res() response, @Body() CreateUserDto: CreateUserDto) {
    try {
      const newEvent = await this.eventService.createUser(CreateUserDto);
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
}
