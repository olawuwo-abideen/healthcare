import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  private async sendMail(options: any) {
    try {
      this.logger.log(`Email sent to ${options.to}`);
      return await this.mailerService.sendMail(options);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new BadRequestException('Internal server error when sending email');
    }
  }

  public async sendResetPasswordLink(user: User): Promise<void> {
    const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}/${user.resetToken}`;
    const text = `Hi, \nHere is your reset password link: ${url}`;

    await this.sendMail({
      to: user.email,
      subject: 'Reset password',
      text,
    });
  }

  public async sendConfirmAppointment(user: User, doctorName: string, date: Date): Promise<void> {
    const formattedDate = new Date(date).toLocaleString();
    const text = `Hi ${user.firstname},\n\nYour appointment with Dr. ${doctorName} is confirmed for ${formattedDate}.\n\nThank you for choosing our service.`;

    await this.sendMail({
      to: user.email,
      subject: 'Appointment Confirmation',
      text,
    });
  }

  public async sendCancelAppointment(user: User, date: Date): Promise<void> {
    const formattedDate = new Date(date).toLocaleString();
    const text = `Hi ${user.firstname},\n\nYour appointment scheduled for ${formattedDate} has been successfully canceled.\n\nPlease rebook if needed or contact support for refund`;

    await this.sendMail({
      to: user.email,
      subject: 'Appointment Canceled',
      text,
    });
  }
}
