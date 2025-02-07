import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../../shared/entities/appointment.entity';
import { BookAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { User } from 'src/shared/entities/user.entity';
import { AvailabilitySlot } from 'src/shared/entities/availabilityslot.entity';


@Injectable()
export class AppointmentService {
constructor(
@InjectRepository(Appointment)
private readonly appointmentRepository: Repository<Appointment>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
@InjectRepository(AvailabilitySlot)
private readonly availabilitySlotRepository: Repository<AvailabilitySlot>,
) {}

async bookAppointment(
user: User, 
{ doctorId, availabilitySlotId }: BookAppointmentDto,
): Promise<{ message: string; appointment: Appointment }> {
const [doctor, availabilitySlot] = await Promise.all([
this.userRepository.findOne({ where: { id: doctorId } }),
this.availabilitySlotRepository.findOne({ where: { id: availabilitySlotId } }),
]);

if (!doctor || !availabilitySlot) {
throw new NotFoundException('Doctor or availability slot not found');
}

if (!availabilitySlot.isAvailable) {
throw new BadRequestException('This slot is already booked');
}
await this.availabilitySlotRepository.update(availabilitySlot.id, { isAvailable: false });

const appointment = this.appointmentRepository.create({
user, 
doctor,
availabilitySlot,
status: AppointmentStatus.CONFIRMED,
});

return {
message: 'Appointment booked successfully',
appointment: await this.appointmentRepository.save(appointment),
};
}


async getPatientAppointments(user: User): Promise<{ message: string; data: Appointment[] }> {
const appointments = await this.appointmentRepository.find({
where: { user: { id: user.id } },
relations: ['doctor', 'availabilitySlot'],
});

return {
message: 'Patient appointments retrieved successfully',
data: appointments,
};
}

async getDoctorAppointments(user: User): Promise<{ message: string; data: Appointment[] }> {
const appointments = await this.appointmentRepository.find({
where: { user: { id: user.id } },
relations: ['patient', 'availabilitySlot'],
});

return {
message: 'Doctor appointments retrieved successfully',
data: appointments,
};
}

async getAppointmentDetails(user: User, id: string): Promise<{ message: string; data: Appointment }> {
const appointment = await this.appointmentRepository.findOne({
where: { id, user: { id: user.id } },
relations: ['doctor', 'patient', 'availabilitySlot'],
});

if (!appointment) throw new NotFoundException('Appointment not found');

return {
message: 'Appointment details retrieved successfully',
data: appointment,
};
}

async updateAppointment(
user: User,
id: string,
{ doctorId, availabilitySlotId }: UpdateAppointmentDto,
): Promise<{ message: string; appointment: Appointment }> {
const appointment = await this.appointmentRepository.findOne({
where: { id, user: { id: user.id } },
relations: ['availabilitySlot'],
});

if (!appointment) throw new NotFoundException('Appointment not found');

const doctor = await this.userRepository.findOne({ where: { id: doctorId } });
const newSlot = await this.availabilitySlotRepository.findOne({ where: { id: availabilitySlotId } });

if (!doctor || !newSlot) throw new NotFoundException('Doctor or availability slot not found');
if (!newSlot.isAvailable) throw new BadRequestException('This slot is already booked');

appointment.availabilitySlot.isAvailable = true;
await this.availabilitySlotRepository.save(appointment.availabilitySlot);

appointment.doctor = doctor;
appointment.availabilitySlot = newSlot;
newSlot.isAvailable = false;
await this.availabilitySlotRepository.save(newSlot);

return {
message: 'Appointment updated successfully',
appointment: await this.appointmentRepository.save(appointment),
};
}



async rescheduleAppointment(
appointmentId: string,
newSlotId: string
): Promise<{ message: string; appointment: Appointment }> {
const appointment = await this.appointmentRepository.findOne({ where: { id: appointmentId } });

if (!appointment) throw new NotFoundException('Appointment not found');

const newSlot = await this.availabilitySlotRepository.findOne({ where: { id: newSlotId } });

if (!newSlot || !newSlot.isAvailable) {
throw new BadRequestException('New slot is not available');
}

appointment.availabilitySlot.isAvailable = true;
await this.availabilitySlotRepository.save(appointment.availabilitySlot);

newSlot.isAvailable = false;
await this.availabilitySlotRepository.save(newSlot);

appointment.availabilitySlot = newSlot;
const updatedAppointment = await this.appointmentRepository.save(appointment);

return { message: 'Appointment rescheduled successfully', appointment: updatedAppointment };
}


async cancelAppointment(user:User, id:string): Promise<{ message: string }> {
const appointment = await this.appointmentRepository.findOne({
where: { id, user: { id: user.id }
}
})
if (!appointment) throw new NotFoundException('Appointment not found');

appointment.availabilitySlot.isAvailable = true;
await this.availabilitySlotRepository.save(appointment.availabilitySlot);

await this.appointmentRepository.remove(appointment);

return { message: 'Appointment canceled successfully' };
}
}
