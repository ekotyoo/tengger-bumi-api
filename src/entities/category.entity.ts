import { BaseEntity, Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ReportType } from "./ReportType.entity"
import { Report } from "./report.entity"

@Entity("categories")
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column()
    name!: string

    @Column({
        type: 'enum',
        enum: ReportType,
        default: ReportType.PENCEGAHAN
    })
    type!: ReportType

    @OneToMany(() => Report, (report) => report.category)
    reports!: Report[]
}