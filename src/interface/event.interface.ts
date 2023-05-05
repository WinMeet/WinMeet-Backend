import { Document } from 'mongoose';
export interface EventInterface extends Document {

  readonly eventOwner: string;

  readonly eventName: string;

  readonly eventDescription: string;

  readonly location: string;

<<<<<<< HEAD
  readonly eventDates: Array<EventDates>;
=======
  readonly eventDates: Array<Date>;
>>>>>>> 78f603bdaaa41da7cb39b9af9ed5343685bc9795

  readonly eventPollDueDate: Date;

  readonly eventStartDate: Date;

  readonly eventEndDate: Date;

  readonly participants: string[];
}