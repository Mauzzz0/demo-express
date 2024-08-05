import { inject, injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { ConfigService } from '../../config/config.service';
import { Components } from '../../shared/inversify.types';

@injectable()
export class MailService {
  private readonly transport: Transporter;

  constructor(@inject(Components.ConfigService) private readonly config: ConfigService) {
    this.transport = nodemailer.createTransport({
      service: 'yandex',
      host: 'smtp.yandex.ru',
      port: 587,
      secure: false,
      auth: { user: this.config.env.SMTP_USER, pass: this.config.env.SMTP_PASS },
    });
  }

  public async sendMail(options: Omit<Mail.Options, 'from'>): Promise<void> {
    return this.transport.sendMail({ from: `${this.config.env.SMTP_USER}@yandex.ru`, ...options });
  }

  public async sendRestoreMessage(to: string, key: string) {
    await this.transport.sendMail({
      from: `${this.config.env.SMTP_USER}@yandex.ru`,
      to,
      subject: 'Restore password',
      html: `Your key for password changing: <b>${key}</b>`,
    });

    console.log(`Successfully sent restore password mail to ${to}`);

    return true;
  }
}
