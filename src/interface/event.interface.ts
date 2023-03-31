import { Document } from 'mongoose';
export interface EventInterface extends Document {
  readonly eventName: string;

  readonly eventDescription: string;

  readonly location: string;

  readonly eventStartDate: Date;

  readonly eventEndDate: Date;

  readonly participants: string[];
}
