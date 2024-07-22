import { Telegraf } from 'telegraf';

export const startAndReturnBot = async (token: string) => {
  const bot = new Telegraf(token);
  bot.start((ctx) => ctx.reply('Welcome'));
  await bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};
