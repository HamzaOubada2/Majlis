import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto {
    @ApiProperty({example: 'user@example.com', description:'Email'})
    @IsEmail({},{message: 'Invalid Email address'})
    @IsNotEmpty({message: 'Email are Required'})
    email:string;
    
    @ApiProperty({ example: 'Password123', description: 'Password (at least 6 characters)' })
    @IsString()
    @IsNotEmpty({message: 'Password are Required'})
    password:string;
}