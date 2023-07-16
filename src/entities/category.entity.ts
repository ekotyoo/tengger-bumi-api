import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Plant } from "./plant.entity"

@Entity("categories")
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    icon_path!: string

    @OneToMany(() => Plant, (report) => report.category)
    plants!: Plant[]
}