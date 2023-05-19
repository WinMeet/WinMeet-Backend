import {
  isArray,
  IsDate,
  IsNotEmpty,
  isString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  eventOwner: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  eventName: string;

  @IsString()
  eventDescription: string;

  @IsString()
  location: string;

  @IsNotEmpty()
  eventStartDate: Date;

  @IsNotEmpty()
  eventEndDate: Date;

  participants: string[];

  eventStartDate2: Date;

  eventEndDate2: Date;

  eventStartDate3: Date;

  eventEndDate3: Date;

  eventVote1: number;

  eventVote2: number;

  eventVote3: number;

  eventVoteDuration: Date;

  isPending: boolean;

  voters: string[];
}
