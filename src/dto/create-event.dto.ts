import { IsDate, IsNotEmpty, IsString, MaxLength } from "class-validator";


export class CreateEventDto{
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly eventName:string;

    @IsString()
    readonly eventDescription:string;

    @IsDate()
    @IsNotEmpty()
    readonly eventStartDate:Date;

    @IsDate()
    @IsNotEmpty()
    readonly eventEndDate:Date;

    @IsString()    
    readonly location:string;
}