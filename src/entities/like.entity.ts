import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Plant } from "./plant.entity";
import { User } from "./user.entity";

@Entity('likes')
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ default: true })
    is_like!: boolean

    @ManyToOne(() => Plant, (plant) => plant.likes, { onDelete: "CASCADE" })
    @JoinColumn()
    plant!: Plant

    @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User
}