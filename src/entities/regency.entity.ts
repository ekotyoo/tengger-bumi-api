import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Province } from "./province.entity"
import { District } from "./district.entity"

@Entity("regencies")
export class Regency extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @ManyToOne(() => Province, (province) => province.regencies, { onDelete: "CASCADE" })
    @JoinColumn()
    province!: Province

    @OneToMany(() => District, (district) => district.regency)
    districts!: District[]
}