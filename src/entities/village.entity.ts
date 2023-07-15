import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { District } from "./district.entity"
import { Plant } from "./plant.entity"

@Entity("villages")
export class Village extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @ManyToOne(() => District, (district) => district.villages, { onDelete: "CASCADE" })
    @JoinColumn()
    district!: District

    @OneToMany(() => Plant, (plant) => plant.village)
    @JoinColumn()
    plants!: Plant[]
}