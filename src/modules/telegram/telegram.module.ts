import { Container } from 'inversify';

import { Components } from '../../shared/inversify.types';
import { TelegramService } from './telegram.service';

export const createTelegramModule = () => {
  const container = new Container();

  container.bind<TelegramService>(Components.Telegram).to(TelegramService).inSingletonScope();

  return container;
};
