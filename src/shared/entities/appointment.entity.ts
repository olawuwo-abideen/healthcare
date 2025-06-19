import {
Entity,
PrimaryGeneratedColumn,
Column,
ManyToOne,
CreateDateColumn,
UpdateDateColumn,
DeleteDateColumn,
OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { AvailabilitySlot } from './availabilityslot.entity';
import { Exclude } from 'class-transformer';
import { Transaction } from './transaction.entity';

export enum AppointmentStatus {
PENDING = 'pending',
CONFIRMED = 'confirmed',
CANCELED = 'canceled',
COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
@PrimaryGeneratedColumn('uuid')
id: string;

@ManyToOne(() => User, (user) => user.appointments)
user: User;

// @ManyToOne(() => User, (user) => user.appointments)
// doctor: User;

@ManyToOne(() => AvailabilitySlot, { eager: true })
availabilitySlot: AvailabilitySlot;

@Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
status: AppointmentStatus;

@OneToMany(() => Transaction, (transaction) => transaction.appointment)
transactions: Transaction[];


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
