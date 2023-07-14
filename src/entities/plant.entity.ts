import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Image } from "./image.entity";
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { Area } from "./area.entity";

@Entity("plants")
export class Plant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "timestamp" })
    planting_date!: Date

    @Column()
    planting_count!: number

    @Column()
    plant_name!: string

    @Column("double")
    latitude!: number

    @Column("double")
    longitude!: number

    @Column()
    description!: string

    @ManyToOne(() => Category, (category) => category.plants)
    @JoinColumn()
    category!: Category

    @ManyToOne(() => Area, (area) => area.plants)
    @JoinColumn()
    area!: Area

    @OneToMany(() => Image, (image) => image.plant, { cascade: ["insert"] })
    images!: Image[]

    @ManyToOne(() => User, (user) => user.plants, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User

    @OneToMany(() => Comment, (comment) => comment.plant)
    comments!: Comment[]

    @OneToMany(() => Like, (like) => like.plant)
    likes!: Like[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}