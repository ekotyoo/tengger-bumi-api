import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, Generated, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Image } from "./image.entity";
import { User } from "./user.entity";

export enum ReportCategory {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

@Entity("reports")
export class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column({
        type: "enum",
        enum: ReportCategory,
        default: ReportCategory.LOW
    })
    category!: ReportCategory

    @Column()
    is_active!: boolean

    @Column("double")
    latitude!: number

    @Column("double")
    longitude!: number

    @Column()
    description!: string

    @OneToMany(() => Image, (image) => image.report, { cascade: ["insert"] })
    images!: Image[]

    @ManyToOne(() => User, (user) => user.reports, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}