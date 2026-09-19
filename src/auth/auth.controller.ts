import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService){}

    @ApiOperation({ summary: 'Register New User' })
    @ApiResponse({ status: 201, description: 'The account was created, and the JWT token was returned successfully.' })
    @ApiResponse({ status: 409, description: 'The email address is already in use.' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @ApiOperation({ summary: 'Log in and obtain a JWT token' })
    @ApiResponse({ status: 200, description: 'Logged in successfully.' })
    @ApiResponse({ status: 401, description: 'The login details are incorrect.' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
