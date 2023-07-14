import { PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Entity, BaseEntity, CreateDateColumn } from "typeorm";
import { Plant } from "./plant.entity";

@Entity("images")
export class Image extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    file_path!: string

    @CreateDateColumn()
    created_at!: Date

    @ManyToOne(() => Plant, (plant) => plant.images, { onDelete: "CASCADE" })
    @JoinColumn()
    plant!: Plant
}