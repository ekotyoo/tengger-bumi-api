import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { District } from "./district.entity"

@Entity("villages")
export class Village extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @ManyToOne(() => District, (district) => district.villages, { onDelete: "CASCADE" })
    @JoinColumn()
    district!: District
}