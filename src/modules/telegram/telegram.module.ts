import { Container } from 'inversify';
import { TelegramRabbitController } from './telegram.rabbit-controller';
import { TelegramService } from './telegram.service';

const TelegramModule = new Container();

TelegramModule.bind(TelegramService).toSelf().inSingletonScope();
TelegramModule.bind(TelegramRabbitController).toSelf().inSingletonScope();

export default TelegramModule;
