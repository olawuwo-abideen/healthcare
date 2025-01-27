import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/reset-password.dto';
import {  Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';


@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Sign-Up' })
  @ApiBody({ type: SignupDto, description: 'User Sign-Up Data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'User successfully signed up.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  async signup(@Body() data: SignupDto) {
    return await this.authService.signup(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Log-In' })
  @ApiBody({ type: LoginDto, description: 'User Log-In Data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed in. Access token generated.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'User Forgot password' })
  @ApiBody({ type: ForgotPasswordDto, description: 'User email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User Forgot password,Input email to reset',
  })
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'User Reset Pasword' })
  @ApiBody({ type: ResetPasswordDto, description: 'User reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User Password Reset.',
  })
  async resetPassword(@Body() payload: ResetPasswordDto){
    await this.authService.resetPassword(payload);
  }


  @Post('signout')
  @ApiOperation({ summary: 'User Log-Out' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User successfully signed out. Refresh token cleared from the cookie.',
  })
  async signOut(@CurrentUser() user: Partial<User>, @Res() res: Response) {
    return await this.authService.logout(user, res);
  }
  

}
