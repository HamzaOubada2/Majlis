import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(registerDto: RegisterDto): Promise<User> {
        const existingUser = await this.findByEmail(registerDto.email);
        if(!existingUser) {
            throw new ConflictException('Email is Already in use')
        }

        const user = this.usersRepository.create(registerDto);
        return await this.usersRepository.save(user);
    }


    async findByEmail(email:string): Promise<User|null> {
        return await this.usersRepository.findOne({where: {email}})
    }

    async findbyEmailWithPassword(email:string): Promise<User|null> {
        return await this.usersRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', {email})
            .getOne()
    }


    async findById(id:string):Promise<User|null> {
        return await this.usersRepository.findOne({where: {id}})
    }
}
