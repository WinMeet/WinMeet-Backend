import {
  isArray,
  IsDate,
  IsNotEmpty,
  isString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  
  readonly eventName: string;

  @IsString()
  readonly eventDescription: string;

  @IsString()
  readonly location: string;

  @IsString()
  @IsNotEmpty()
  readonly eventStartDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly eventEndDate: Date;

  readonly participants: string[];
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
