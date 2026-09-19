import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../../enums/UserRole";



@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique: true})
    email:string;

    @Column({select: false})
    password: string;


    @Column()
    fullname:string;


    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.ATTENDEE,
    })
    role:UserRole;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}