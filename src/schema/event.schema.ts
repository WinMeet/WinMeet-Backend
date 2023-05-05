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
<<<<<<< HEAD
  eventDates: Array<EventDates>;
=======
  eventDates: Array<Date>;
>>>>>>> 78f603bdaaa41da7cb39b9af9ed5343685bc9795

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