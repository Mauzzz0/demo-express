import { connect } from 'amqp-connection-manager';
import { injectable } from 'inversify';
import { appConfig } from '../config';
import logger from '../logger';

@injectable()
export class RabbitMqService {
  private readonly connection = connect(appConfig.rabbitUrl);
  public readonly channel = this.connection.createChannel({ json: true });

  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.connection.connect();
      await this.channel.waitForConnect();
    } catch (err) {
      logger.error("Can't connect to RabbitMQ:");
      logger.error(err);
      throw err;
    }

    logger.info('Successfully connected to RabbitMQ');
  }
}
