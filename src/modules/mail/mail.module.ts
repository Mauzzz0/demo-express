import { Container } from 'inversify';
import { MailService } from './mail.service';

export const createMailModule = () => {
  const container = new Container();

  container.bind(MailService).toSelf().inSingletonScope();

  return container;
};
