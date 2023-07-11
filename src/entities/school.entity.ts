import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { Report } from "./report.entity";
import { Room } from "./room.entity";

@Entity("schools")
export class School extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    address!: string

    @Column("double")
    latitude!: number

    @Column("double")
    longitude!: number

    @Column({ nullable: true, default: null, type: "text" })
    cover_image_path!: string | null

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @OneToMany(() => Report, (report) => report.school)
    reports!: Report[]

    @OneToMany(() => Room, (room) => room.school, { "cascade": ["insert"] })
    rooms!: Room[]
}