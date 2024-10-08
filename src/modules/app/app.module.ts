import { Container } from 'inversify';
import { ConfigService } from '../../config/config.service';
import { Components } from '../../shared/inversify.types';
import { App } from './app';

export const createAppModule = () => {
  const container = new Container();

  container.bind<App>(Components.Application).to(App).inSingletonScope();
  container.bind<ConfigService>(Components.ConfigService).to(ConfigService).inSingletonScope();

  return container;
};
