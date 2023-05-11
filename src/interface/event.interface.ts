import { Document } from 'mongoose';
export interface EventInterface extends Document {

  readonly eventOwner: string;

  readonly eventName: string;

  readonly eventDescription: string;

  readonly location: string;

  readonly eventStartDate: Date;

  readonly eventEndDate: Date;

  readonly eventStartDate2: Date;

  readonly eventEndDate2: Date;

  readonly eventStartDate3: Date;

  readonly eventEndDate3: Date;

  readonly eventVote1: number;

  readonly eventVote2: number;
  
  readonly eventVote3: number;

  readonly eventVoteDuration: Date;

  readonly participants: string[];

  readonly isPending: boolean;
}