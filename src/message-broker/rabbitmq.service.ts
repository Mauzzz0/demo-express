import { connect } from 'amqp-connection-manager';
import { injectable } from 'inversify';
import { appConfig } from '../config';
import logger from '../logger';
import { RABBIT_MQ_QUEUES } from './rabbitmq.queues';

@injectable()
export class RabbitMqService {
  private readonly connection = connect(appConfig.rabbitUrl);
  public readonly channel = this.connection.createChannel({ json: true });

  constructor() {
    this.init();
  }

  async init() {
    try {
      // Waiting for successfully connection
      await this.connection.connect({ timeout: 2000 });
      await this.channel.waitForConnect();

      // Assert queues
      for (const queue of RABBIT_MQ_QUEUES) {
        await this.channel.assertQueue(queue, { durable: true });
      }
    } catch (err) {
      logger.error("Can't connect to RabbitMQ:");
      logger.error(err);
      throw err;
    }

    logger.info('Successfully connected to RabbitMQ');
  }
}
