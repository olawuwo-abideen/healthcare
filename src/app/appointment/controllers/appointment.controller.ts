import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, HttpStatus, Patch } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { BookAppointmentDto, RescheduleAppointmentDto } from '../dto/appointment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { User } from '../../../shared/entities/user.entity';
import { UserRole } from '../../../shared/entities/user.entity';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { RolesGuard } from '../../../app/auth/guards/role.guard';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';


@ApiBearerAuth()
@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
constructor(private readonly appointmentService: AppointmentService) {}

@Get('')
@ApiOperation({ summary: 'Get user appointment' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment retrieved successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
async getPatientAppointments(@CurrentUser() user: User) {
return this.appointmentService.getPatientAppointments(user);
}

@Post('booking')    
@ApiOperation({ summary: 'book appointment from availability slot' })
@ApiBody({ type: BookAppointmentDto, 
description: 'Create appointment data' })
@ApiResponse({
status: HttpStatus.CREATED,
description:
'Appointment booked successfully.',
})
@UseGuards(AuthGuard, RolesGuard) 
@Roles(UserRole.PATIENT)
async bookAppointment(
@CurrentUser() user: User,
@Body() data: BookAppointmentDto) {
return this.appointmentService.bookAppointment(user, data);
}





@Get('')
@ApiOperation({ summary: 'Get appointment with patient' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment retrieved successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR)
async getAppointmentsByDoctor(@CurrentUser() user: User) {
return this.appointmentService.getDoctorAppointments(user);
}

@Get(':id')
@ApiOperation({ summary: 'Get appointment details' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment retrieved successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR,UserRole.PATIENT)
async getAppointmentDetails(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string) {
return this.appointmentService.getAppointmentDetails(user, id);
}


@Put('reschedule/:id')
@ApiOperation({ summary: 'Reschedule appointment' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment reschedule successfully.',
})
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PATIENT)
async rescheduleAppointment(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string, 
@Body() data: RescheduleAppointmentDto) {
return this.appointmentService.rescheduleAppointment(user, id, data);
}

@Patch('cancel/:id')
@ApiOperation({ summary: 'Cancel appointment' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment Cancel successfully.',
})
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.PATIENT)
async cancelAppointment(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe ) id: string) {
return this.appointmentService.cancelAppointment(user, id);
}


}
