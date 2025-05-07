import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { inject } from 'inversify';
import { ConfigService } from '../../config/config.service';
import { RABBIT_MQ_QUEUES } from './rabbitmq.queues';

export class RabbitMqService {
  public readonly channel: ChannelWrapper;

  constructor(@inject(ConfigService) private readonly configService: ConfigService) {
    this.channel = connect(this.configService.env.rabbitUri).createChannel();

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
        exclusive: false,
        autoDelete: false,
      });
    }
  }
}
