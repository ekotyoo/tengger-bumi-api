import { Entity, Column, PrimaryGeneratedColumn, Generated, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Report } from "./report.entity";

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

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @Column({ nullable: true, default: null })
    avatar_path!: string
}