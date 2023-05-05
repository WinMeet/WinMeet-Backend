import { Document } from 'mongoose';
export interface EventInterface extends Document {

  readonly eventOwner: string;

  readonly eventName: string;

  readonly eventDescription: string;

  readonly location: string;

  readonly eventPollDueDate: Date;

  readonly eventStartDate: Date;

  readonly eventEndDate: Date;

  readonly eventStartDate2: Date;

  readonly eventEndDate2: Date;

  readonly eventStartDate3: Date;

  readonly eventEndDate3: Date;

  readonly participants: string[];
}