    import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
    import { User } from './user.entity';
    import { Exclude } from 'class-transformer';

    @Entity('medicalrecords')
    export class MedicalRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'medicalrecord_id', type: 'uuid', nullable: true, })
    medicalrecordId: string;


    @Column({ type: 'uuid',  name: 'user_id', nullable: false })
    userId: string;


    @ManyToOne(() => User, (user) => user.medicalrecords)
    patient: User;

    @ManyToOne(() => User, (user) => user.medicalrecords)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User)
    doctor: User;


    @Column({ nullable: true })
    uploadedfiles: string;


    @Column({ type: 'text' })
    description: string;


    @CreateDateColumn({
    name: 'created_at',
    })
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn({
    name: 'updated_at',
    })
    @Exclude()
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    @Exclude()
    deletedAt: Date;
    }
