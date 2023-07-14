import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Regency } from "./regency.entity"

@Entity("provinces")
export class Province extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @OneToMany(() => Regency, (regency) => regency.province)
    regencies!: Regency[]
}