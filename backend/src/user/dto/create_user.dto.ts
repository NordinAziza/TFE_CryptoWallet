
import { IsEmail, IsNotEmpty, IsString,} from 'class-validator'
import { Unique } from 'typeorm';

@Unique(['email'])

export class CreateUserDto{
    @IsString()
    username:string;
    @IsEmail()
    email:string;
    @IsNotEmpty()
    password:string;
    @IsString()
    address:string;
    @IsString()
    key:string;

}