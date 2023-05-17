import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, Generated, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { Image } from "./image.entity";
import { User } from "./user.entity";
import { School } from "./school.entity";
import { Category } from "./category.entity";
import { Room } from "./room.entity";

@Entity("reports")
export class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column()
    is_active!: boolean

    @Column("double")
    latitude!: number

    @Column("double")
    longitude!: number

    @Column()
    description!: string

    @OneToOne(() => Category)
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

    @OneToOne(() => Room)
    @JoinColumn()
    room!: Room

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}