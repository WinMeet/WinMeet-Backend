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
  @MaxLength(30)
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

/*{
    "eventName": "test31",
    "eventDescription": "fdsfdsaf",
    "location": "fdsafasdf",
    "eventStartDate": "2023-03-24T19:00:14.463386",
    "eventEndDate": "2023-03-24T20:00:14.463506",
    "participants": [
  "test@test.com"
    ]
}*/
