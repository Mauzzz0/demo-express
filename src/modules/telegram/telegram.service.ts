import { inject, injectable } from 'inversify';
import { Telegraf } from 'telegraf';
import { ConfigService } from '../../config/config.service';
import { UserModel } from '../../database/models';
import { redisTelegramKey } from '../../database/redis/redis.keys';
import { RedisService } from '../../database/redis/redis.service';

@injectable()
export class TelegramService {
  readonly bot: Telegraf;

  constructor(
    @inject(ConfigService) private readonly config: ConfigService,
    @inject(RedisService) private readonly redis: RedisService,
  ) {
    // this.bot = new Telegraf(this.config.env.telegramToken);
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
          const user = await UserModel.findOne({ where: { id: res.userId } });
          if (user) {
            user.telegram = ctx.update.message.from.id;
            await user.save();

            return await ctx.reply(`Welcome, ${user.nick}`);
          }
        }
      }

      return await ctx.reply('Welcome');
    });
  }
}
