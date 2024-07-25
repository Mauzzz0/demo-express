import { Container } from 'inversify';

import { ConfigService } from '../../config/config.service';
import { RestApplication } from '../../rest.application';
import { Components } from '../../shared/inversify.types';

export const createAppModule = () => {
  const container = new Container();

  container.bind<RestApplication>(Components.Application).to(RestApplication).inSingletonScope();
  container.bind<ConfigService>(Components.ConfigService).to(ConfigService).inSingletonScope();

  return container;
};
