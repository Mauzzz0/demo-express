import { Telegraf } from 'telegraf';

export const startAndReturnBot = (token: string) => {
  const bot = new Telegraf(token);
  bot.start((ctx) => ctx.reply('Welcome'));
  bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};
