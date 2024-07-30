import { Container } from 'inversify';

import { Components } from '../../shared/inversify.types';
import { CronService } from './cron.service';

export const createCronModule = () => {
  const container = new Container();

  container.bind(Components.CronService).to(CronService).inSingletonScope();

  return container;
};
