import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Regency } from "./regency.entity"
import { Village } from "./village.entity"

@Entity("districts")
export class District extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @ManyToOne(() => Regency, (regency) => regency.districts, { onDelete: "CASCADE" })
    @JoinColumn()
    regency!: Regency

    @OneToMany(() => Village, (village) => village.district)
    villages!: Village[]
}