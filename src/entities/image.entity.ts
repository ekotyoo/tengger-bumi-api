import { PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Entity, BaseEntity, CreateDateColumn } from "typeorm";
import { Report } from "./report.entity";

@Entity("images")
export class Image extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    file_path!: string

    @CreateDateColumn()
    created_at!: Date

    @ManyToOne(() => Report, (report) => report.images, { onDelete: "CASCADE" })
    @JoinColumn()
    report!: Report
}