import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { inject } from 'inversify';
import { ConfigService } from '../../config/config.service';
import { NEW_REGISTRATION_QUEUE } from './rabbitmq.queues';

export class RabbitMqService {
  public readonly channel: ChannelWrapper;

  constructor(@inject(ConfigService) private readonly configService: ConfigService) {
    this.channel = connect(this.configService.env.rabbitUri).createChannel();

    this.init();
  }

  async init() {
    await this.channel.waitForConnect();
    await this.assertQueues();
    await this.initHandlers();
  }

  async assertQueues() {
    const cfg = {
      durable: true,
      exclusive: false,
      autoDelete: false,
    };

    await this.channel.assertQueue(NEW_REGISTRATION_QUEUE, cfg);
  }

  async initHandlers() {
    // await this.channel.consume(NEW_REGISTRATION_QUEUE, async (message) => {
    //   const json = JSON.parse(message.content.toString());
    //
    //   await this.logRegistration(json);
    // });
  }

  private async logRegistration(message: any) {
    console.log(message);
  }
}
