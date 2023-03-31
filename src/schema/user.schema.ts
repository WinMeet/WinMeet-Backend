import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop()
    userName: string;
  
    @Prop()
    userSurname: string;
  
    @Prop()
    userEmail: string;
  
    @Prop()
    userPassword: Date;
  }

  export const UserSchema = SchemaFactory.createForClass(User);