import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seminar } from './entities/seminar.entity';
import { Repository } from 'typeorm';
import { CreateSeminarDto } from './dtos/create-seminar.dto';
import { ScholarsService } from '../scholars/scholars.service';
import { UpdateSeminarDto } from './dtos/update-seminar.dto';

@Injectable()
export class SeminarsService {
  constructor(
    @InjectRepository(Seminar)
    private readonly seminarRepository: Repository<Seminar>,
    private readonly scholarsService: ScholarsService,
  ) {}

  //create
  async create(createSeminarDto: CreateSeminarDto): Promise<Seminar> {
    const { scholarId, ...seminarData } = createSeminarDto;

    const seminar = new Seminar();
    Object.assign(seminar, seminarData);
    seminar.availableSeats = seminarData.capacity;

    if (scholarId) {
      seminar.scholar = await this.scholarsService.findOne(scholarId);
    }

    return await this.seminarRepository.save(seminar);
  }

  //findAll
  async findAll(): Promise<Seminar[]> {
    return await this.seminarRepository.find({
      relations: { scholar: true }, // جلب بيانات المحاضر المرتبط تلقائياً
      order: { eventDate: 'ASC' },
    });
  }

  //findOne
  async findOne(id: string): Promise<Seminar> {
    const seminar = await this.seminarRepository.findOne({
      where: { id },
      relations: { scholar: true },
    });

    if (!seminar) {
      throw new NotFoundException(
        `The seminar with the ID ${id} does not exist`,
      );
    }

    return seminar;
  }

  //Update
  async update(id: string, updateSeminarDto: UpdateSeminarDto): Promise<Seminar> {
  const seminar = await this.findOne(id);
  const { scholarId, ...seminarData } = updateSeminarDto;

  Object.assign(seminar, seminarData);

  if (scholarId) {
    const scholar = await this.scholarsService.findOne(scholarId);
    seminar.scholar = scholar;
  }

  return await this.seminarRepository.save(seminar);
}


  //Remove:
  async remove(id: string): Promise<void> {
    const seminar = await this.findOne(id);
    await this.seminarRepository.remove(seminar);
  }
}
