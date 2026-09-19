import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto {
    @IsEmail({},{message: 'Invalid Email address'})
    @IsNotEmpty({message: 'Email are Required'})
    email:string;

    @IsString()
    @IsNotEmpty({message: 'Password are Required'})
    password:string;
}