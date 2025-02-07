import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';
import { AppointmentStatus } from 'src/shared/entities/appointment.entity';


export class BookAppointmentDto {
@ApiProperty({
description: 'doctorId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
doctorId: string;


@ApiProperty({
description: 'availabilitySlotId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
availabilitySlotId: string;
}


export class UpdateAppointmentDto {

@ApiProperty({
description: 'doctorId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
doctorId?: string;

@ApiProperty({
description: 'availabilitySlotId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
availabilitySlotId?: string;
}

