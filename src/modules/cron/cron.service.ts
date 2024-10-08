import { CronJob } from 'cron';
import { inject, injectable } from 'inversify';
import { Components } from '../../shared/inversify.types';
import { TelegramService } from '../telegram/telegram.service';
import { CronSchedule } from './cron.schedule';

@injectable()
export class CronService {
  constructor(@inject(Components.Telegram) private readonly telegramService: TelegramService) {}

  private readonly jobs: CronJob[] = [
    new CronJob(CronSchedule.every1Minute, this.sendHi.bind(this), null, true, 'Europe/Moscow'),
  ];

  public startJobs() {
    this.jobs.map((job) => job.start());
  }

  private async sendHi() {
    // await this.telegramService.bot.telegram.sendMessage(834333336, 'Это ежеминутный спам!');
  }
}
