import { inject, injectable } from 'inversify';
import { Telegraf } from 'telegraf';
import { redisTelegramKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { appConfig } from '../../config';
import { UserEntity } from '../../database';
import { BadRequestException } from '../../exceptions';
import logger from '../../logger';

@injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor(@inject(RedisService) private readonly redis: RedisService) {
    const token = appConfig.telegramToken;
    if (token) {
      this.bot = new Telegraf(token);
    }

    this.start();
  }

  async start() {
    if (!this.bot) {
      logger.warn('Telegram token is not set, bot is not started');
      return;
    }

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

    this.initHandlers();

    this.bot.launch();
    logger.info(`Telegram bot started`);
  }

  public async sendMessage(...args: Parameters<typeof this.bot.telegram.sendMessage>) {
    if (!this.bot) {
      logger.warn('Telegram bot not started, message ignored');
      return;
    }

    await this.bot.telegram.sendMessage(...args);
  }

  public async getBotInfo() {
    this.checkBotOrThrowError();

    return this.bot.telegram.getMe();
  }

  private checkBotOrThrowError() {
    if (!this.bot) {
      throw new BadRequestException('Telegram bot not started. Operation forbidden');
    }
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
