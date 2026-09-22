import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Scholar } from '../scholars/entities/scholar.entity';
import { Seminar } from '../seminars/entities/seminar.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationStatus } from '../enums/ReservationStatus';

export interface AdminOverview {
  totalUsers: number;
  totalScholars: number;
  totalSeminars: number;
  activeSeminars: number;
  endedSeminars: number;
  totalCapacity: number;
  totalAvailableSeats: number;
  totalBookedSeats: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalReservations: number;
  reservationPercentage: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Scholar)
    private readonly scholarRepository: Repository<Scholar>,
    @InjectRepository(Seminar)
    private readonly seminarRepository: Repository<Seminar>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async getOverview(): Promise<AdminOverview> {
    const totalUsers = await this.userRepository.count();
    const totalScholars = await this.scholarRepository.count();
    const seminars = await this.seminarRepository.find();

    const now = Date.now();
    const totalSeminars = seminars.length;
    const activeSeminars = seminars.filter(
      (s) => new Date(s.eventDate).getTime() > now,
    ).length;

    const totalCapacity = seminars.reduce(
      (sum, s) => sum + Number(s.capacity),
      0,
    );
    const totalAvailableSeats = seminars.reduce(
      (sum, s) => sum + s.availableSeats,
      0,
    );
    const totalBookedSeats = Math.max(0, totalCapacity - totalAvailableSeats);

    const confirmedReservations = await this.reservationRepository.count({
      where: { status: ReservationStatus.CONFIRMED },
    });
    const cancelledReservations = await this.reservationRepository.count({
      where: { status: ReservationStatus.CANCELLED },
    });
    const totalReservations = confirmedReservations + cancelledReservations;

    const reservationPercentage =
      totalCapacity > 0
        ? Math.min(100, Math.round((totalBookedSeats / totalCapacity) * 100))
        : 0;

    return {
      totalUsers,
      totalScholars,
      totalSeminars,
      activeSeminars,
      endedSeminars: Math.max(0, totalSeminars - activeSeminars),
      totalCapacity,
      totalAvailableSeats,
      totalBookedSeats,
      confirmedReservations,
      cancelledReservations,
      totalReservations,
      reservationPercentage,
    };
  }

  async findAllReservations(seminarId?: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: seminarId ? { seminarId } : {},
      relations: {
        user: true,
        seminar: {
          scholar: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
}