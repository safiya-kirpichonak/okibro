import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as Imap from 'imap';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import { Tokens } from './types';
import { LoginDto, SignupDto } from './dto';
import { Hash } from '../common/helpers/hash';
import { TokensService } from './tokens.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { ReasonPhrases, StatusCodes } from '../common/helpers/http';

@Injectable()
export class AuthLocalService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private tokensService: TokensService,
  ) {}

  async signupLocal(dto: SignupDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user) throw new BadRequestException('Email already exists.');

    const managementLink = await Hash.generateRandomBytes(48);
    const managementLinkHash = await Hash.hash(managementLink);
    const passwordHash = await Hash.hash(dto.password);
    const role = await this.prisma.role.findUnique({
      where: { name: this.config.get('DEFAULT_ROLE') },
    });

    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        managementLink: managementLinkHash,
        password: passwordHash,
        role: {
          connect: {
            id: role.id,
          },
        },
      },
    });

    const clientAddress = this.config.get('CLIENT_URL_EMAIL');
    const body = `Please click this link to confirm your mail: ${clientAddress}confirmation/${managementLink}`;
    const subject = 'Confirmation in Okibro';
    try {
      await this.sendEmail(body, subject, dto.email);
    } catch (error) {
      throw new BadRequestException();
    }

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async loginLocal(dto: LoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new BadRequestException('User does not exist.');
    if (!user.isActive) throw new BadRequestException('Account was blocked.');
    const isCompare = await Hash.compare(dto.password, user.password);
    if (!isCompare) throw new BadRequestException('Incorrect password.');

    return await this.tokensService.createNewTokens(user.id);
  }

  async logout(sub: string): Promise<any> {
    await this.prisma.user.update({
      where: {
        id: sub,
      },
      data: {
        refreshToken: null,
      },
    });

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async confirmEmailLocal(token: string): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: { managementLink: { not: null } },
    });
    const promises = users.map(
      async (user) => await Hash.compare(token, user.managementLink),
    );
    const results = await Promise.all(promises);
    const index = results.findIndex((result) => result);
    if (!users[index]) throw new BadRequestException();

    await this.prisma.user.update({
      where: { id: users[index].id },
      data: {
        isActive: true,
        managementLink: null,
      },
    });

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async forgotPasswordSendEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email, isActive: true },
    });
    if (!user || !user.isActive) throw new BadRequestException();

    const managementLink = await Hash.generateRandomBytes(48);
    const managementLinkHash = await Hash.hash(managementLink);
    await this.prisma.user.update({
      data: {
        managementLink: managementLinkHash,
      },
      where: {
        email,
      },
    });

    const clientAddress = this.config.get('CLIENT_URL_EMAIL');
    const body = `Please click this link to change your password: ${clientAddress}forgot-password/${managementLink}`;
    const subject = 'Forgot password in Okibro';
    try {
      await this.sendEmail(body, subject, email);
    } catch (error) {
      throw new BadRequestException();
    }

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async forgotPasswordUpdatePassword(
    token: string,
    newPassword: string,
  ): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: { managementLink: { not: null } },
    });
    const promises = users.map(
      async (user) => await Hash.compare(token, user.managementLink),
    );
    const results = await Promise.all(promises);
    const index = results.findIndex((result) => result);
    if (!users[index]) throw new BadRequestException();

    const passwordHash = await Hash.hash(newPassword);
    await this.prisma.user.update({
      where: { id: users[index].id },
      data: {
        managementLink: null,
        password: passwordHash,
      },
    });

    return { status: StatusCodes.OK, message: ReasonPhrases.OK };
  }

  async refreshTokens(sub: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    });
    if (!user || !user.refreshToken) throw new ForbiddenException();
    const isCompare = await Hash.compare(refreshToken, user.refreshToken);
    if (!isCompare) throw new ForbiddenException();
    return await this.tokensService.createNewTokens(user.id);
  }

  private async sendEmail(
    body: string,
    subject: string,
    recipientEmail: string,
  ): Promise<Boolean> {
    const smtpPort = this.config.get('SMTP_PORT');
    const imapPort = this.config.get('IMAP_PORT');
    const smtpServer = this.config.get('SMTP_SERVER');
    const imapServer = this.config.get('IMAP_SERVER');
    const senderEmail = this.config.get('OKIBRO_EMAIL_ADDRESS');
    const senderPassword = this.config.get('OKIBRO_EMAIL_PASSWORD');

    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: smtpPort,
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    const imap = new Imap({
      user: senderEmail,
      password: senderPassword,
      host: imapServer,
      port: imapPort,
      tls: true,
    });

    return await new Promise((resolve, reject) => {
      imap.once('ready', () => {
        imap.openBox('Sent', true, (error: Error) => {
          if (error) {
            imap.end();
            reject(false);
            return;
          }

          const emailMessage = `From: ${senderEmail}\r\nTo: ${recipientEmail}\r\nSubject: ${subject}\r\n\r\n${body}`;
          imap.append(emailMessage, { mailbox: 'Sent' }, () => {
            imap.end();
            resolve(true);
          });
        });
      });

      imap.once('error', (_: Error) => reject(false));
      imap.connect();
    });
  }
}
