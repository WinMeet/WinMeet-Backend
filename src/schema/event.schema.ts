import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Event {
  @Prop()
  eventOwner: string;

  @Prop()
  eventName: string;

  @Prop()
  eventDescription: string;

  @Prop()
  location: string;

  @Prop()
  eventStartDate: Date;

  @Prop()
  eventEndDate: Date;

  @Prop()
  eventStartDate2: Date;

  @Prop()
  eventEndDate2: Date;

  @Prop()
  eventStartDate3: Date;

  @Prop()
  eventEndDate3: Date;

  @Prop()
  eventVote1: number;

  @Prop()
  eventVote2: number;

  @Prop()
  eventVote3: number;

  @Prop()
  participants: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);