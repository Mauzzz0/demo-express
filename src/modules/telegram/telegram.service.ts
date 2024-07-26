import { inject, injectable } from 'inversify';
import { Telegraf } from 'telegraf';

import { ConfigService } from '../../config/config.service';
import { Components } from '../../shared/inversify.types';

@injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor(
    @inject(Components.ConfigService)
    private readonly config: ConfigService,
  ) {
    this.bot = new Telegraf(this.config.env.TELEGRAM_TOKEN);
  }

  async start() {
    if (!this.bot) return;

    this.initShutdownHooks();
    this.initHandlers();

    this.bot.launch();
  }

  private initShutdownHooks() {
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  private initHandlers() {
    this.bot.start((ctx) => ctx.reply('Welcome'));
  }
}
