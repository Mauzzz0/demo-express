import { connect } from 'amqp-connection-manager';
import { injectable } from 'inversify';
import { appConfig } from '../../config';
import { RABBIT_MQ_QUEUES } from './rabbitmq.queues';

@injectable()
export class RabbitMqService {
  public readonly channel = connect(appConfig.rabbitUri).createChannel();

  constructor() {
    this.init();
  }

  async init() {
    await this.channel.waitForConnect();
    await this.assertQueues();
  }

  private async assertQueues() {
    for (const queue of RABBIT_MQ_QUEUES) {
      await this.channel.assertQueue(queue, {
        durable: true,
      });
    }
  }
}
