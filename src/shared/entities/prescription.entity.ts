import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';


@Entity('prescriptions')
export class Prescription {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ name: 'prescription_id', type: 'uuid', nullable: true,  })
prescriptionId: string;

@Column({ type: 'uuid', name: 'user_id', nullable: true })
userId: string;

@ManyToOne(() => User, (user) => user.prescriptions)
patient: User;

@ManyToOne(() => User, (user) => user.prescriptions)
@JoinColumn({ name: 'user_id' })
user: User;

@ManyToOne(() => User)
doctor: User;

@Column()
medicine: string;

@Column()
dosage: string;

@Column({ type: 'text' })
instructions: string;


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
