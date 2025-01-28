import { Container } from 'inversify';
import { ConfigService } from '../../config/config.service';
import { App } from './app';

export const createAppModule = () => {
  const container = new Container();

  container.bind(App).toSelf().inSingletonScope();
  container.bind(ConfigService).toSelf().inSingletonScope();

  return container;
};
