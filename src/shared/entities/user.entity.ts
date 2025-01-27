import { Exclude, instanceToPlain } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToMany
} from 'typeorm';


export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}


export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', length: 30, nullable: true })
  firstname?: string;

  @Column({ name: 'lastname', length: 30, nullable: true })
  lastname?: string;

  @Column({ name: 'age', nullable: true })
  age?: number;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ unique: true, length: 20 })
  phonenumber: string;

  @Column({ nullable: true })
  userimage?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    name: 'gender',
    
  })
  gender: Gender;



  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  @Exclude()
  resetToken: string | null;


  
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

  toJSON?(): Record<string, any> {
    return instanceToPlain(this);
  }
}
