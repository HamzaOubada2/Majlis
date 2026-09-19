import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../../enums/UserRole";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";



export class RegisterDto {
    @ApiProperty({example: 'user@example.com', description:'Email'})
    @IsEmail({}, {message: 'Invalid Email address'})
    @IsNotEmpty({message: 'Email Required'})
    email:string;

    @ApiProperty({ example: 'Password123', description: 'Password (at least 6 characters)' })
    @IsString()
    @MinLength(6, {message:'The password must be at least 6 characters long'})
    password:string;

    @ApiProperty({ example: 'Hamza Oubada', description: 'FullName' })
    @IsString()
    @IsNotEmpty({message: 'FullName Required!'})
    fullName:string;

    @ApiPropertyOptional({ enum: UserRole, default: UserRole.ATTENDEE, description: 'User Role...' })
    @IsEnum(UserRole)
    @IsOptional()
    role?:UserRole;
}