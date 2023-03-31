import { isArray, IsDate, IsNotEmpty, isString, IsString, MaxLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly userName:string;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly userSurname:string;

    @IsString()
    @IsNotEmpty()
    readonly userEmail:string;

    @IsString()
    @IsNotEmpty()
    readonly userPassword:string;
}