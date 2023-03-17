import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose'

@Schema()
export class Event{   

    @Prop()
    eventName:string;

    @Prop()
    eventDescription:string;
    
    @Prop()
    eventStartDate:Date;

    @Prop()
    eventEndDate:Date;

    @Prop()
    eventLocation:string;

    @Prop()
    participants:string[];
}

export const EventSchema = SchemaFactory.createForClass(Event)