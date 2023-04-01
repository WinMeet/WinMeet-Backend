import { Injectable, NotFoundException, Redirect, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { EventSchema } from 'src/schema/event.schema';

import { MailerService } from '@nestjs-modules/mailer';
import { UserInterface } from 'src/interface/user.interface';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserInterface>) {}

  //creating event
  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const newUser = await new this.userModel(createUserDto);

    // this.sendMail(createEventDto.participants, createEventDto);
    return newUser.save();
  }

  //read all events
}
