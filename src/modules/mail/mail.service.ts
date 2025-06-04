import { injectable } from 'inversify';
import { createTransport, SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { appConfig } from '../../config';
import logger from '../../logger/pino.logger';

@injectable()
export class MailService {
  private readonly transport = createTransport({
    service: 'yandex',
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false,
    auth: { user: appConfig.smtp.user, pass: appConfig.smtp.pass },
  });

  public async sendMail(options: Omit<Mail.Options, 'from'>): Promise<SentMessageInfo> {
    return this.transport.sendMail({ ...options, from: `${appConfig.smtp.user}@yandex.ru` });
  }

  public async sendRestoreMessage(to: string, key: string): Promise<SentMessageInfo> {
    const info = await this.transport.sendMail({
      from: `${appConfig.smtp.user}@yandex.ru`,
      to,
      subject: 'Restore password',
      html: `Your key for password changing: <b>${key}</b>`,
    });

    logger.info(`Successfully sent restore password mail to ${to}`);

    return info;
  }
}
