import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Event {
  @Prop({ required: true })
  eventOwner: string;

  @Prop({ required: true })
  eventName: string;

  @Prop()
  eventDescription: string;

  @Prop()
  location: string;

  @Prop({ required: true })
  eventStartDate: Date;

  @Prop({ required: true })
  eventEndDate: Date;

  @Prop()
  eventStartDate2: Date;

  @Prop()
  eventEndDate2: Date;

  @Prop()
  eventStartDate3: Date;

  @Prop()
  eventEndDate3: Date;

  @Prop({default: 0})
  eventVote1: number;

  @Prop({default: 0})
  eventVote2: number;

  @Prop({default: 0})
  eventVote3: number;

  @Prop()
  eventVoteDuration: Date;

  @Prop()
  participants: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);