import { Container } from 'inversify';

import { Components } from '../../shared/inversify.types';
import { MailService } from './mail.service';

export const createMailModule = () => {
  const container = new Container();

  container.bind(Components.MailService).to(MailService).inSingletonScope();

  return container;
};
