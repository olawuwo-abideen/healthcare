import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../../shared/entities/appointment.entity';
import { BookAppointmentDto, RescheduleAppointmentDto } from '../dto/appointment.dto';
import { User } from '../../../shared/entities/user.entity';
import { AvailabilitySlot } from '../../../shared/entities/availabilityslot.entity';
import Stripe from 'stripe';
import { Transaction, TransactionStatus } from 'src/shared/entities/transaction.entity';
import { EmailService } from 'src/shared/modules/email/email.service';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

@Injectable()
export class AppointmentService {
constructor(
@InjectRepository(Appointment)
private readonly appointmentRepository: Repository<Appointment>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
@InjectRepository(AvailabilitySlot)
private readonly availabilitySlotRepository: Repository<AvailabilitySlot>,
@InjectRepository(Transaction)
private readonly transactionRepository: Repository<Transaction>,
private readonly emailService: EmailService,
) {}


async getUserAppointments(user: User): Promise<{ message: string; data: Appointment[] }> {
const appointments = await this.appointmentRepository.find({
where: { user: { id: user.id } },
relations: [ 'availabilitySlot'],
});

return {
message: 'Patient appointments retrieved successfully',
data: appointments,
};
}
  async bookAppointment(
    user: User,
    { availabilitySlotId, paymentMethodId }: BookAppointmentDto,
  ): Promise<{ message: string; appointment: Appointment }> {
    const availabilitySlot = await this.availabilitySlotRepository.findOne({
      where: { id: availabilitySlotId },
    });
    if (!availabilitySlot) throw new NotFoundException('Availability slot not found');
    if (!availabilitySlot.isAvailable) throw new BadRequestException('This slot is already booked');

    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(availabilitySlot.amount) * 100),
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
      });
    } catch (err) {
      throw new BadRequestException(`Payment failed: ${err.message}`);
    }

    await this.availabilitySlotRepository.update(availabilitySlot.id, { isAvailable: false });

    const appointment = this.appointmentRepository.create({
      user: { id: user.id },
      availabilitySlot: { id: availabilitySlot.id },
      status: AppointmentStatus.CONFIRMED,
    });
    const savedAppointment = await this.appointmentRepository.save(appointment);

    const transaction = this.transactionRepository.create({
      user: { id: user.id },
      appointment: { id: savedAppointment.id },
      amount: availabilitySlot.amount,
      status: TransactionStatus.SUCCESS,
      paymentIntentId: paymentIntent.id,
      currency: paymentIntent.currency,
    });
    await this.transactionRepository.save(transaction);

    const fullSlot = await this.availabilitySlotRepository.findOne({
      where: { id: availabilitySlot.id },
      relations: ['user'],
    });
    await this.emailService.sendConfirmAppointment(user, fullSlot.user.firstname, fullSlot.startTime);

    return { message: 'Appointment booked and payment successful', appointment: savedAppointment };
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



async rescheduleAppointment(
     user: User,
  id: string,
  data: RescheduleAppointmentDto
): Promise<{ message: string; appointment: Appointment }> {
  const appointment = await this.appointmentRepository.findOne({
    where: { id },
    relations: ['user', 'availabilitySlot'],
  });

  if (!appointment) throw new NotFoundException('Appointment not found');
  if (appointment.user.id !== user.id) throw new ForbiddenException();

  const newSlot = await this.availabilitySlotRepository.findOne({ where: { id: data.newAvailabilitySlotId } });
  if (!newSlot || !newSlot.isAvailable) {
    throw new BadRequestException('New slot is not available');
  }

  // Release old slot
  if (appointment.availabilitySlot) {
    appointment.availabilitySlot.isAvailable = true;
    await this.availabilitySlotRepository.save(appointment.availabilitySlot);
  }

  // Reserve new slot
  newSlot.isAvailable = false;
  await this.availabilitySlotRepository.save(newSlot);

  // Update appointment
  appointment.availabilitySlot = newSlot;
  const updated = await this.appointmentRepository.save(appointment);

  return { message: 'Appointment rescheduled successfully', appointment: updated };
}

  async cancelAppointment(user: User, id: string): Promise<{ message: string }> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'availabilitySlot'],
    });
    if (!appointment || appointment.user.id !== user.id) throw new ForbiddenException('Not authorized');

    appointment.status = AppointmentStatus.CANCELED;

    if (appointment.availabilitySlot) {
      appointment.availabilitySlot.isAvailable = true;
      await this.availabilitySlotRepository.save(appointment.availabilitySlot);
    }

    await this.appointmentRepository.save(appointment);
    await this.emailService.sendCancelAppointment(user, appointment.availabilitySlot.startTime);

    return { message: 'Appointment canceled successfully' };
  }


}

