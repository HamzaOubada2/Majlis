import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Scholar } from "./entities/scholar.entity";
import { Repository } from "typeorm";
import { CreateScholarDto } from "./dtos/create-scholar.dto";
import { UpdateScholarDto } from "./dtos/update-scholar.dto";


@Injectable()
export class ScholarsService {
    constructor(
        @InjectRepository(Scholar)
        private readonly scholarRepository: Repository<Scholar>,
    ){}


    // Create
    async create(createScholarDto:CreateScholarDto): Promise<Scholar> {
        const scholar = this.scholarRepository.create(createScholarDto);
        return await this.scholarRepository.save(scholar);
    }

    // Find All
    async findAll():Promise<Scholar[]> {
        return this.scholarRepository.find();
    }

    // find One
    async findOne(id:string): Promise<Scholar> {
        const scholar = await this.scholarRepository.findOne({where: {id}});
        if(!scholar) {
            throw new NotFoundException('The Id Not Found!');
        }    
        return scholar;
    }

    // update
    async update(id:string, updateScholarDto:UpdateScholarDto): Promise<Scholar> {
        const scholar = await this.findOne(id);
        Object.assign(scholar, updateScholarDto);
        return await this.scholarRepository.save(scholar);
    }


    // delete
    async delete(id:string):Promise<void> {
        const scholar = await this.findOne(id);
        await this.scholarRepository.remove(scholar);
    }
}