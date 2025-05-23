import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { NEW_REGISTRATION_QUEUE } from '../../message-broker/rabbitmq/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq/rabbitmq.service';

@injectable()
export class TelegramRabbitController {
  constructor(
    @inject(RabbitMqService)
    private readonly rabbitMqService: RabbitMqService,
  ) {
    this.assertHandler();
  }

  async assertHandler() {
    await this.rabbitMqService.channel.consume(
      NEW_REGISTRATION_QUEUE,
      (data) => this.handleNewRegistrationQueue(data),
      {
        noAck: true, // <-- ОЧЕНЬ ВАЖНАЯ НАСТРОЙКА!
        prefetch: 2, // <-- ОЧЕНЬ ВАЖНАЯ НАСТРОЙКА!
      },
    );
  }

  async handleNewRegistrationQueue(data: ConsumeMessage) {
    const json = JSON.parse(data.content.toString());

    console.log(json);
  }
}
