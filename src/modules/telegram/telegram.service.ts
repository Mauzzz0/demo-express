import { inject, injectable } from 'inversify';
import { Telegraf } from 'telegraf';
import { redisTelegramKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { appConfig } from '../../config';
import { UserEntity } from '../../database';
import logger from '../../logger';

@injectable()
export class TelegramService {
  readonly bot: Telegraf;

  constructor(@inject(RedisService) private readonly redis: RedisService) {
    const token = appConfig.telegramToken;
    if (token) {
      this.bot = new Telegraf(token);
      logger.info(`Telegram bot started`);
    } else {
      logger.warn('Telegram token is not set, bot is not started');
    }
  }

  async start() {
    // if (!this.bot) return;
    //
    // this.initShutdownHooks();
    // this.initHandlers();
    //
    // this.bot.launch();
  }

  private initShutdownHooks() {
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  private initHandlers() {
    this.bot.start(async (ctx) => {
      const payload = ctx.payload;
      if (payload) {
        const res = await this.redis.get(redisTelegramKey(payload));
        if (res?.userId) {
          const user = await UserEntity.findOne({ where: { id: res.userId } });
          if (user) {
            user.telegram = ctx.update.message.from.id;
            await user.save();

            return await ctx.reply(`Welcome, ${user.name}`);
          }
        }
      }

      return await ctx.reply('Welcome');
    });
  }
}
