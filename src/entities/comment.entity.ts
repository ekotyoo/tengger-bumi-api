import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Report } from "./report.entity"
import { User } from "./user.entity"

@Entity("comments")
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    comment!: string

    @ManyToOne(() => Report, (report) => report.comments, { onDelete: "CASCADE" })
    @JoinColumn()
    report!: Report

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    @JoinColumn()
    author!: User

    @CreateDateColumn()
    created_at!: Date
}