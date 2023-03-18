import { isArray, IsDate, IsNotEmpty, isString, IsString, MaxLength } from "class-validator";


export class CreateEventDto{
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly eventName:string;

    @IsString()
    readonly eventDescription:string;

    @IsString()
    @IsNotEmpty()
    eventStartDate:Date;

    @IsString()
    @IsNotEmpty()
    eventEndDate:Date;

    @IsString()    
    readonly location:string;

    @IsString()
    readonly participants:string;

}