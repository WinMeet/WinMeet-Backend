import { Document } from 'mongoose';
export interface EventInterface extends Document {

  readonly eventOwner: string;

  readonly eventName: string;

  readonly eventDescription: string;

  readonly location: string;

  readonly eventDates: Array<EventDates>;

  readonly eventPollDueDate: Date;

  readonly eventStartDate: Date;

  readonly eventEndDate: Date;

  participants: string[];
}