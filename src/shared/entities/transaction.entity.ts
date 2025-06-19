import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity'; 
import { Appointment } from './appointment.entity';

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column()
  paymentIntentId: string;

  @Column({ default: 'usd' }) // or 'ngn', etc.
  currency: string;

  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  user: User;

  @ManyToOne(() => Appointment, (appointment) => appointment.transactions, { nullable: true })
  appointment: Appointment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
