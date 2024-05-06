import { Sequelize } from 'sequelize-typescript';
import models from './models';
import config from '../config';

export const connectDatabase = async () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: config.POSTGRESQL_HOST,
    database: config.POSTGRESQL_DATABASE,
    username: config.POSTGRESQL_USERNAME,
    password: config.POSTGRESQL_PASSWORD,
    port: config.POSTGRESQL_PORT,
    logging: false,
  });

  sequelize.addModels(models);
  await sequelize.sync({ alter: true });
  await sequelize.authenticate();

  return sequelize;
};
