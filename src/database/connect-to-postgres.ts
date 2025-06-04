import { Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import logger from '../logger/pino.logger';
import { entities } from './entities';
import { seeds } from './seeds';

export const connectToPostgres = async () => {
  // Create connection
  const sequelize = new Sequelize({
    ...appConfig.postgres,
    dialect: 'postgres',
    logging: false,
  });

  // Register models
  sequelize.addModels(entities);

  // Ping database
  try {
    await sequelize.authenticate();
  } catch (err) {
    logger.error("Can't connect to Postgres:");
    logger.error(err);
    throw err;
  }

  // Synchronize tables
  await sequelize.sync({ alter: true });

  // Apply seeds
  for (const seed of seeds) {
    await seed();
  }

  logger.info('Successfully connected to database');
};
