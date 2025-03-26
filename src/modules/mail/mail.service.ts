import { inject, injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '../../config/config.service';
import logger from '../../logger/pino.logger';

@injectable()
export class MailService {
  private readonly transport: Transporter;

  constructor(@inject(ConfigService) private readonly config: ConfigService) {
    this.transport = nodemailer.createTransport({
      service: 'yandex',
      host: 'smtp.yandex.ru',
      port: 587,
      secure: false,
      auth: { user: this.config.env.smtp.user, pass: this.config.env.smtp.pass },
    });
  }

  public async sendMail(options: Omit<Mail.Options, 'from'>): Promise<void> {
    return this.transport.sendMail({ from: `${this.config.env.smtp.user}@yandex.ru`, ...options });
  }

  public async sendRestoreMessage(to: string, key: string) {
    await this.transport.sendMail({
      from: `${this.config.env.smtp.user}@yandex.ru`,
      to,
      subject: 'Restore password',
      html: `Your key for password changing: <b>${key}</b>`,
    });

    logger.info(`Successfully sent restore password mail to ${to}`);

    return true;
  }
}
