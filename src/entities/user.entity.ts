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

    @Column({ nullable: true, type: 'text' })
    avatar_path!: string | null

    @Column({ default: false })
    is_active!: boolean

    @Column({ default: false })
    is_admin!: boolean

    @Column({ nullable: true, type: 'text' })
    otp!: string | null
}