import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../../enums/UserRole";



export class RegisterDto {
    @IsEmail({}, {message: 'Invalid Email address'})
    @IsNotEmpty({message: 'Email Required'})
    email:string;


    @IsString()
    @MinLength(6, {message:'The password must be at least 6 characters long'})
    password:string;


    @IsString()
    @IsNotEmpty({message: 'FullName Required!'})
    fullName:string;

    @IsEnum(UserRole)
    @IsOptional()
    role?:UserRole;
}