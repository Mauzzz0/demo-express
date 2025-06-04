import { Container } from 'inversify';
import { RabbitMqService } from './rabbitmq.service';

const RabbitMqModule = new Container();

RabbitMqModule.bind(RabbitMqService).toSelf().inSingletonScope();

export default RabbitMqModule;
