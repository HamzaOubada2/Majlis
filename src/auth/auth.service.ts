import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}


    // Register
    async register(registerDto:RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        const token = this.generateToken(user.id, user.email, user.role);
        return {user, access_token: token};
    }



    // Login
    async login(loginDto:LoginDto) {
        const user = await this.usersService.findbyEmailWithPassword(loginDto.email);
        if(!user) {
            throw new UnauthorizedException('Incorrect login details');
        }

        const IspasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if(!IspasswordValid) {
            throw new UnauthorizedException('Incorrect login details')
        }

        const { password, ...userRecord } = user;
        
        const token = this.generateToken(user.id, user.email,user.role);
        return {user: userRecord, access_token: token};
    }



    // Generate Token
    private generateToken(userId:string,email:string,role:string): string {
        const payload = {sub: userId, email,role};
        return this.jwtService.sign(payload);
    }
}

/*
    POST /login
        │
        ▼
    AuthService
        │
        │ email
        ▼
    UsersService
        │
        ▼
    findbyEmailWithPassword()
        │
        ▼
    Database
        │
        ▼
    User + password hash
        │
        ▼
    bcrypt.compare()
        │
    ┌──┴──┐
    │     │
    ❌     ✅
    401     │
            ▼
        Generate JWT
            │
            ▼
        access_token
*/