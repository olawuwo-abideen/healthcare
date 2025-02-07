import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (doctor) => doctor.availabilitySlots)
  user: User;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: true })
  isAvailable: boolean;

  // @OneToMany(() => Appointment, (appointment) => appointment.slot)
  // appointments: Appointment[];

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
