import { Container } from 'inversify';
import { MailService } from './mail.service';

const MailModule = new Container();

MailModule.bind(MailService).toSelf().inSingletonScope();

export default MailModule;
