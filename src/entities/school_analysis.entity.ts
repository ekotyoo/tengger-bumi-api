import { BaseEntity, Column, CreateDateColumn, Entity, Generated, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { School } from "./school.entity";

@Entity("school_analysis")
export class SchoolAnalysis extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @Generated("uuid")
    uuid!: string

    @Column({ nullable: true, default: null })
    prevention_level!: number

    @Column({ nullable: true, default: null })
    emergency_response_level!: number

    @Column({ nullable: true, default: null })
    recovery_level!: number

    @OneToOne(() => School, { onDelete: "CASCADE" })
    school!: School

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}