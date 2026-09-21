import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Scholar } from "../../scholars/entities/scholar.entity";


@Entity('seminars')
export class Seminar {
    @PrimaryGeneratedColumn('uuid')
    id:string;


    @Column()
    title:string;


    @Column({type:'text', nullable: true})
    description:string;


    @Column({type: 'timestamp'})
    eventDate:Date;

    @Column()
    location:string;


    @Column({type: 'int'})
    capacity:string;

    
    @ManyToOne(() => Scholar, {onDelete: 'SET NULL', nullable: true})
    @JoinColumn({name: 'scholarId'})
    scholar: Scholar;

    @Column({nullable: true})
    scholarId:string;

    @CreateDateColumn()
    createdAt:Date;


    @UpdateDateColumn()
    updatedAt:Date;
}