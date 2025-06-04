import { inject, injectable } from 'inversify';
import logger from '../../logger';
import { NEW_REGISTRATION_QUEUE } from '../../message-broker/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq.service';
import { NewRegistrationMessage } from './user.types';

@injectable()
export class UserAmqpController {
  constructor(
    @inject(RabbitMqService)
    private readonly rabbitMqService: RabbitMqService,
  ) {
    this.assertHandler();
  }

  async assertHandler() {
    await this.rabbitMqService.channel.waitForConnect();
    await this.rabbitMqService.channel.consume(
      NEW_REGISTRATION_QUEUE,
      (data) => this.handleNewRegistrationQueue(JSON.parse(data.content.toString('utf-8'))),
      {
        noAck: true, // Акаем автоматически
        prefetch: 2, // Параллельно обрабатываем макс 2 задачи
      },
    );
  }

  async handleNewRegistrationQueue(data: NewRegistrationMessage) {
    const { id, name, email } = data;
    logger.info(`Новая регистрация (${id}) ${name} with email ${email}`);
  }
}
