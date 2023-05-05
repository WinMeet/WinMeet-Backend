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
  eventDates: Array<Date>;

  @Prop()
  eventPollDueDate: Date;

  @Prop()
  eventStartDate: Date;

  @Prop()
  eventEndDate: Date;

  @Prop()
  participants: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);