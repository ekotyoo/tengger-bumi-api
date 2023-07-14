import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Plant } from "./plant.entity"

@Entity("areas")
export class Area extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @OneToMany(() => Plant, (plant) => plant.area)
    plants!: Plant[]
}