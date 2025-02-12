import { Controller, Delete, Get, HttpStatus, Param,UseGuards, Query } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {

constructor(private readonly adminService: AdminService){}

@Get('/users')
@ApiOperation({ summary: 'Get all users' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Retrieved all users successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
public async getAllUsers(@Query() paginationData: PaginationDto) {
return await this.adminService.getAllUsers(paginationData);
}


@Delete('user/:id')
@ApiOperation({ summary: 'Delete a user' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Delete a user successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
public async deleteUser(
@Param('id', IsValidUUIDPipe) id: string,
)  {    
return await this.adminService.deleteUser({ id });
}


@Get('patients')
@ApiOperation({ summary: 'Get all patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
async getAllPatients(@Query() paginationData: PaginationDto) {
return await this.adminService.getAllPatients(paginationData);
}


@Get('patient/:id')
@ApiOperation({ summary: 'Get patient' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patient.',
})
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Patient not found.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
async getPatient(@Param('id', IsValidUUIDPipe) id: string,) {
return await this.adminService.getPatient(id);
}


@Get('doctors')
@ApiOperation({ summary: 'Get all doctors' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved doctors.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
async getAllDoctors(@Query() paginationData: PaginationDto) {
return await this.adminService.getAllDoctors(paginationData);
}


@Get('doctor/:id')
@ApiOperation({ summary: 'Get doctor' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved doctor.',
})
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Doctor not found.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
async getDoctor(@Param('id', IsValidUUIDPipe) id: string,) {
return await this.adminService.getDoctor(id);
}



}