    import { ApiProperty } from '@nestjs/swagger';
    import { IsNotEmpty, IsDate, IsOptional } from 'class-validator';

    export class SetAvailabilityDto {

    @ApiProperty({
    description: 'Appointment start time',
    example: '2025-02-07T09:00:00.000Z',
    })
    @IsDate()
    @IsNotEmpty()
    startTime: Date;

    @ApiProperty({
    description: 'Appointment end time',
    example: '2025-03-07T09:00:00.000Z',
    })
    @IsDate()
    @IsNotEmpty()
    endTime: Date;


    @ApiProperty({
    description: 'Appointment slot availability',
    example: 'true',
    })
    @IsNotEmpty()
    isAvailable: boolean;
    }


    export class UpdateAvailabilityDto {

    @ApiProperty({
    description: 'Appointment start time',
    example: '2025-02-07T09:00:00.000Z',
    })
    @IsDate()
    @IsNotEmpty()
    startTime: Date;

    @ApiProperty({
    description: 'Appointment end time',
    example: '2025-03-07T09:00:00.000Z',
    })
    @IsDate()
    @IsNotEmpty()
    endTime: Date;


    @ApiProperty({
    description: 'Appointment slot availability',
    example: 'true',
    })
    @IsNotEmpty()
    isAvailable: boolean;
    }
