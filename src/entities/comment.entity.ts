import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Plant } from "./plant.entity"
import { User } from "./user.entity"

@Entity("comments")
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    comment!: string

    @ManyToOne(() => Plant, (plant) => plant.comments, { onDelete: "CASCADE" })
    @JoinColumn()
    plant!: Plant

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    @JoinColumn()
    author!: User

    @CreateDateColumn()
    created_at!: Date
}