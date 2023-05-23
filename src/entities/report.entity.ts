import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Image } from "./image.entity";
import { User } from "./user.entity";
import { School } from "./school.entity";
import { Category } from "./category.entity";
import { Room } from "./room.entity";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";

@Entity("reports")
export class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    is_active!: boolean

    @Column("double")
    latitude!: number

    @Column("double")
    longitude!: number

    @Column()
    description!: string

    @ManyToOne(() => Category, (category) => category.reports)
    @JoinColumn()
    category!: Category

    @OneToMany(() => Image, (image) => image.report, { cascade: ["insert"] })
    images!: Image[]

    @ManyToOne(() => User, (user) => user.reports, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User

    @ManyToOne(() => School, (school) => school.reports, { onDelete: "CASCADE" })
    @JoinColumn()
    school!: School

    @ManyToOne(() => Room, (room) => room.reports, { onDelete: "CASCADE" })
    @JoinColumn()
    room!: Room

    @OneToMany(() => Comment, (comment) => comment.report)
    comments!: Comment[]

    @OneToMany(() => Like, (like) => like.report)
    likes!: Like[]

    @Column("json", { nullable: true })
    additional_infos!: JSON[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}