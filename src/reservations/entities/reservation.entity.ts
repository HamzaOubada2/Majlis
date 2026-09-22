import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Seminar } from "../../seminars/entities/seminar.entity";
import { ReservationStatus } from "../../enums/ReservationStatus";



@Entity('reservations')
@Unique(['user','seminar']) // منع الحجز المكرر لنفس الندوة من قبل نفس المستخدم
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name:'userId'})
    user:User;

    @Column()
    userId:string;


    @ManyToOne(() => Seminar, {onDelete: 'CASCADE'})
    @JoinColumn({name:'seminarId'})
    seminar:Seminar;

    @Column()
    seminarId: string;



    @Column({
        type:'enum',
        enum: ReservationStatus,
        default: ReservationStatus.CONFIRMED
    })
    status: ReservationStatus;


    @CreateDateColumn()
    createdAt:Date;

}