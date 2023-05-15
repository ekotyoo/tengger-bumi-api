import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}