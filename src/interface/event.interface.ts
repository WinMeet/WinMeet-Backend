import { Document } from 'mongoose';
export interface EventInterface extends Document {
  eventOwner: string;

  eventName: string;

  readonly eventDescription: string;

  readonly location: string;

  eventStartDate: Date;

  eventEndDate: Date;

  readonly eventStartDate2: Date;

  readonly eventEndDate2: Date;

  readonly eventStartDate3: Date;

  readonly eventEndDate3: Date;

  readonly eventVote1: number;

  readonly eventVote2: number;

  readonly eventVote3: number;

  readonly eventVoteDuration: Date;

  participants: string[];

  isPending: boolean;

  readonly voters: string[];

  isVoted: boolean;
}
