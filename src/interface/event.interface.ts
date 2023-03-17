import { Document } from "mongoose";
export interface EventInterface extends Document{
    readonly id:string;

    readonly name:string;
    
    readonly date:Date;

    readonly location:string;
}