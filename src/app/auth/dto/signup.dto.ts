import {
IsEmail,
IsEnum,
IsMobilePhone,
IsNotEmpty,
IsString,
Matches,
MaxLength,
MinLength,
} from 'class-validator';
import { PasswordMatch } from 'src/shared/validations/password-validation.dto';
import { UserRole } from 'src/shared/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';


export class SignupDto {


@ApiProperty({
required: true,
description: 'The first name of the user',
example: 'Olawuwo',
})
@IsNotEmpty()
@IsString()
firstname: string;

@ApiProperty({
required: true,
description: 'The last name of the user',
example: 'Abideen',
})
@IsNotEmpty()
@IsString()
lastname: string;

@ApiProperty({
required: true,
description: 'The user email',
example: 'abideenolawuwo@gmail.com',
})
@IsNotEmpty()
@IsEmail()
email: string;


@ApiProperty({
description: 'The user role. Allowed values: admin,  patient or doctor',
enum: UserRole,
example: 'admin',
})
@IsNotEmpty()
@IsEnum(UserRole)
role: UserRole;

@ApiProperty({
required: true,
description: 'The user phone number',
example: '09012345678',
})
@IsNotEmpty()
@IsMobilePhone()
phonenumber: string;

@ApiProperty({
required: true,
description: 'The user password (at least 8 characters)',
example: 'Password123--',
})
@IsNotEmpty()
@IsString()
@MinLength(6, { message: 'Password must be at least 6 characters long' })
@MaxLength(20, { message: 'Password must not exceed 20 characters' })
@Matches(
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
{
message:
'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
},
)
password: string;

@ApiProperty({
required: true,
description: 'The user password (at least 8 characters)',
example: 'Password123--',
})
@IsString()
@IsNotEmpty({ message: 'Confirm password is required' })
@PasswordMatch()
confirmPassword: string;
}
