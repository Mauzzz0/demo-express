import { Container } from 'inversify';
import { RabbitMqService } from './rabbitmq.service';

export const createRabbitMQModule = () => {
  const container = new Container();

  container.bind(RabbitMqService).toSelf();

  return container;
};
