import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Seminar } from '../seminars/entities/seminar.entity';
import { ReservationStatus } from '../enums/ReservationStatus';

@Injectable()
export class ReservationsService {
    constructor(private readonly dataSource:DataSource){}

    async createReservation(userId:string, seminarId:string):Promise<Reservation> {
        /*
        What is it? A tool to have complete control over the database
        Why? So we can start and cancel transactions
        Analogy: Like opening a Word document and deciding to save or discard changes
        */
        const queryRunner = this.dataSource.createQueryRunner(); 
        await queryRunner.connect();  // Connect to database
        await queryRunner.startTransaction(); // Start Transaction

        try{
            //Fetch the seminar and lock the class during the process to prevent conflicts (Pessimistic Write Lock)
            const seminar = await queryRunner.manager.findOne(Seminar, {
                where: {id: seminarId},
                lock: {mode: 'pessimistic_write'}
            })

            if(!seminar) {
                throw new NotFoundException('الندوة غير موجودة')
            }

            if(seminar.availableSeats <= 0) {
                throw new BadRequestException('عذراً، نَفِدَت جميع المقاعد المتاحة لهذه الندوة')
            }

            // التحقق مما إذا كان المستخدم قد حجز هذه الندوة سابقاً
            const existingReservation = await queryRunner.manager.findOne(Reservation, {
                where: { userId, seminarId },
            })

            // إعادة تفعيل حجز ملغى بدلاً من إنشاء سجل مكرر (لتفادي قيد UNIQUE)
            if (existingReservation && existingReservation.status === ReservationStatus.CANCELLED) {
                existingReservation.status = ReservationStatus.CONFIRMED;
                const savedReservation = await queryRunner.manager.save(existingReservation);

                await queryRunner.manager.decrement(Seminar, { id: seminarId }, 'availableSeats', 1);
                await queryRunner.commitTransaction();
                return savedReservation;
            }

            if (existingReservation) {
                throw new ConflictException('لقد قمت بحجز هذه الندوة بالفعل سابقاً')
            }

            // إنشاء نموذج الحجز
            const reservation = queryRunner.manager.create(Reservation, {
                userId,
                seminarId,
                status: ReservationStatus.CONFIRMED,
            });
            // حفظ الحجز
            const savedReservation = await queryRunner.manager.save(reservation);

            // إنقاص عدد المقاعد المتاحة بـ 1 بشكل مباشر في قاعدة البيانات
            await queryRunner.manager.decrement(Seminar, { id: seminarId }, 'availableSeats', 1);

            // تأكيد وحفظ المعاملة نهائياً في قاعدة البيانات
            await queryRunner.commitTransaction();

            return savedReservation;
        } catch(err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }





    // Cancled 
    async cancelReservation(userId:string, reservationId:string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();


        try{
            const reservation = await queryRunner.manager.findOne(Reservation,{
                where: {id:reservationId, userId, status: ReservationStatus.CONFIRMED}
            });

            if(!reservation) {
                throw new NotFoundException('الحجز غير موجود أو ملغى بالفعل')
            }

            reservation.status = ReservationStatus.CANCELLED;
            await queryRunner.manager.save(reservation);

            // استرجاع المقعد للندوة بزيادة حتمية مباشرة
            await queryRunner.manager.increment(Seminar, { id: reservation.seminarId }, 'availableSeats', 1);

            await queryRunner.commitTransaction();
        }catch(err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }finally{
            await queryRunner.release();
        }
    }


    async getUserReservations(userId:string): Promise<Reservation[]> {
        return await this.dataSource.getRepository(Reservation).find({
            where: {userId, status: ReservationStatus.CONFIRMED},
            relations: {
                seminar: {
                    scholar: true,
                },
            },
            order: {createdAt: 'DESC'}
        })
    }
}


























/*
    1. Problem: No Transaction & Locking (Scenario without protection):

    Imagine we have a seminar with only one seat left (availableSeats = 1):
        1- The user (Hamza) clicks on "Book".
        2- The user (Ahmed) clicks on "Book" in the same millisecond.
        The server reads the database for both requests simultaneously:
            - A reservation is created for Hamza, and the number of seats is reduced by 1. availableSeats = 0
            - A reservation is made for Ahmed, and the number of seats is reduced by 1.availableSeats = -1
    !The result: A non-existent seat was reserved, and the database became corrupted. This problem is called Race Condition.


    2-Solution (Transaction & Locking)
        1- Hamza sends the booking request in milliseconds:
            The Transaction database opens and locks (Lock) this seminar in the database.
        2- Ahmed sends the booking request in the same millisecond:
            He finds the queue locked, so Ahmed waits in the queue and does nothing until Hamza's reservation is finished.

            Inside Hamza's transaction:
                Reads: availableSeats = 1. 
                Creates the reservation. 
                Updates the seats to availableSeats = 0. 
                Executes commitTransaction() (completion of the save) and unlocks.
            Now it's Ahmed's turn:
                He unlocks the door and enters to view the row.
                He reads the new seats: availableSeats = 0.
                 The system detects that there are no seats and throws an error: "Sorry, all available seats are filled."


Transaction: Ensures that a set of steps is executed as a single unit (either they all succeed, or they are all cancelled via a rollback, as if nothing had happened).
Locking: Ensures the server processes booking requests for the same seminar sequentially, preventing seat conflicts during periods of high traffic.
*/