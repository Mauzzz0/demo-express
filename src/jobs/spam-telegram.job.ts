import { CronJob } from 'cron';
import { Telegraf } from 'telegraf';

export const spamTelegramJob = (bot: Telegraf, chatId: number) =>
  new CronJob(
    '* * * * * *',
    async function () {
      await bot.telegram.sendMessage(chatId, new Date().toISOString());
    },
    null,
    true,
    'Europe/Moscow',
  );
