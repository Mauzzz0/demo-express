import { Container } from 'inversify';
import { TelegramRabbitController } from './telegram.rabbit-controller';
import { TelegramService } from './telegram.service';

export const createTelegramModule = () => {
  const container = new Container();

  container.bind(TelegramService).toSelf().inSingletonScope();
  container.bind(TelegramRabbitController).toSelf().inSingletonScope();

  return container;
};
