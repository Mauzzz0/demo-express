import { Container } from 'inversify';
import { TelegramService } from './telegram.service';

const TelegramModule = new Container();

TelegramModule.bind(TelegramService).toSelf().inSingletonScope();

export default TelegramModule;
