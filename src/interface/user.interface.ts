import { Document } from 'mongoose';
export interface UserInterface extends Document {
  readonly userName: string;

  readonly userSurname: string;

  readonly userEmail: string;

  readonly userPassword: string;
}
