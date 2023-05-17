import { Entity, Column, PrimaryGeneratedColumn, Generated, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Report } from "./report.entity";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column()
    name!: string

    @Column({
        unique: true,
    })
    email!: string

    @Column({
        default: false,
    })
    isAdmin!: boolean

    @Column({ select: false })
    password!: string

    @OneToMany(() => Report, (report) => report.user)
    reports!: Report[]

    @OneToMany(() => Comment, (comment) => comment.author)
    comments!: Comment[]

    @OneToMany(() => Like, (like) => like.user)
    likes!: Like[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @Column({ nullable: true, default: null })
    avatar_path!: string
}