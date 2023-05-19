import { BaseEntity, Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { School } from "./school.entity";
import { Report } from "./report.entity";

@Entity("rooms")
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column()
    label!: string

    @Column()
    color!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @Column("json")
    polygon!: JSON[]

    @ManyToOne(() => School, (school) => school.rooms, { onDelete: "CASCADE" })
    @JoinColumn()
    school!: School

    @OneToMany(() => Report, (report) => report.room)
    @JoinColumn()
    reports!: Report[]
}