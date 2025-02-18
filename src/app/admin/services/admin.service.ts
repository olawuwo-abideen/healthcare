import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { UserRole } from '../../../shared/entities/user.entity';

@Injectable()
export class AdminService {
constructor(
@InjectRepository(User) private readonly userRepository: Repository<User>,
){}


public async getAllUsers(paginationData: PaginationDto): Promise<{
message:string
data: User[];
currentPage: number;
totalPages: number;
totalItems: number;
}> {
const { page = 1, pageSize = 10 } = paginationData;

const currentPage = Math.max(1, page); 
const limit = Math.min(Math.max(1, pageSize), 10); 

const [users, total] = await this.userRepository.findAndCount({
skip: (currentPage - 1) * limit,
take: limit,
});

return {
message: "Users retrieved sucessfully",
data: users,
currentPage,
totalPages: Math.ceil(total / limit),
totalItems: total,
}
}

public async deleteUser(params: { id: string }): Promise<{ message: string }> {
const { id } = params;


const user = await this.userRepository.findOne({ where: { id } });

if (!user) {
throw new NotFoundException(`User with ID ${id} not found.`);
}
await this.userRepository.delete(id);

return { message: `User with ID ${id} has been successfully deleted.` };
}


public async getAllPatients(paginationData: PaginationDto): Promise<{
message: string;
data: User[];
currentPage: number;
totalPages: number;
totalItems: number;
}> {
const { page = 1, pageSize = 10 } = paginationData;

const currentPage = Math.max(1, page); 
const limit = Math.min(Math.max(1, pageSize), 10); 


const [patients, total] = await this.userRepository.findAndCount({
where: {
role: UserRole.PATIENT,
},
skip: (currentPage - 1) * limit,
take: limit,
});

return {
message: "Patients retrieved successfully",
data: patients,
currentPage,
totalPages: Math.ceil(total / limit),
totalItems: total,
};
}


public async getPatient(id: string): Promise<{
message: string;
data: User;
}> {

const patient = await this.userRepository.findOne({
where: {
id: id,
role: UserRole.PATIENT
},
});

if (!patient) {
throw new NotFoundException(`Patient with ID ${id} not found`);
}

return {
message: "Patient retrieved successfully",
data: patient,
};

}





public async getAllDoctors(paginationData: PaginationDto): Promise<{
message: string;
data: User[];
currentPage: number;
totalPages: number;
totalItems: number;
}> {
const { page = 1, pageSize = 10 } = paginationData;

const currentPage = Math.max(1, page); 
const limit = Math.min(Math.max(1, pageSize), 10); 


const [doctors, total] = await this.userRepository.findAndCount({
where: {
role: UserRole.DOCTOR,
},
skip: (currentPage - 1) * limit,
take: limit,
});

return {
message: "Doctors retrieved successfully",
data: doctors,
currentPage,
totalPages: Math.ceil(total / limit),
totalItems: total,
};
}


public async getDoctor(id: string): Promise<{
message: string;
data: User;
}> {

const doctor = await this.userRepository.findOne({
where: {
id: id,
role: UserRole.DOCTOR
},
});

if (!doctor) {
throw new NotFoundException(`Doctor with ID ${id} not found`);
}

return {
message: "Doctor retrieved successfully",
data: doctor,
};

}

}