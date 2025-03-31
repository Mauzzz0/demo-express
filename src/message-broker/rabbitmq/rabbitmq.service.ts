import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager';
import { inject } from 'inversify';
import { ConfigService } from '../../config/config.service';
import { NEW_REGISTRATION_QUEUE } from './rabbitmq.queues';

export class RabbitMqService {
  private readonly connection: AmqpConnectionManager;
  public readonly channel: ChannelWrapper;

  constructor(@inject(ConfigService) private readonly configService: ConfigService) {
    this.connection = connect(this.configService.env.rabbitUri);
    this.channel = this.connection.createChannel();

    this.initHandlers();
  }

  async initHandlers() {
    await this.channel.consume(NEW_REGISTRATION_QUEUE, async (message) => {
      const json = JSON.parse(message.content.toString());

      await this.logRegistration(json);
    });
  }

  private async logRegistration(message: any) {
    console.log(message);
  }
}
