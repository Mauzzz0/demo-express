import { Container } from 'inversify';
import { TelegramService } from './telegram.service';

export const createTelegramModule = () => {
  const container = new Container();

  container.bind<TelegramService>(TelegramService).toSelf().inSingletonScope();

  return container;
};
