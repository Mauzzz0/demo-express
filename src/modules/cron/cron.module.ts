import { Container } from 'inversify';
import { CronService } from './cron.service';

export const createCronModule = () => {
  const container = new Container();

  container.bind(CronService).toSelf().inSingletonScope();

  return container;
};
