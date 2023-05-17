import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "./report.entity";
import { User } from "./user.entity";

@Entity('likes')
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column({ default: true })
    is_like!: boolean

    @ManyToOne(() => Report, (report) => report.likes, { onDelete: "CASCADE" })
    @JoinColumn()
    report!: Report

    @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User
}