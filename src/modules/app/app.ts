import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize-typescript';

import { logRoutes } from '../../bootstrap/logRoutes';
import { ConfigService } from '../../config/config.service';
import { models } from '../../database/models';
import { seeds } from '../../database/seeds';
import { ErrorHandler, LogMiddleware, SessionMiddleware, ViewsMiddleware } from '../../middlewares';
import { Components } from '../../shared/inversify.types';
import { setupSwagger } from '../../swagger/setupSwagger';
import { TaskController } from '../task/task.controller';
import { UserController } from '../user/user.controller';

@injectable()
export class App {
  private readonly server: Express;

  constructor(
    @inject(Components.ConfigService)
    private readonly config: ConfigService,
    @inject(Components.UserController)
    private readonly userController: UserController,
    @inject(Components.TaskController)
    private readonly taskController: TaskController,
  ) {
    this.server = express();
  }

  private async connectPostgres() {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: this.config.env.POSTGRESQL_HOST,
      database: this.config.env.POSTGRESQL_DATABASE,
      username: this.config.env.POSTGRESQL_USERNAME,
      password: this.config.env.POSTGRESQL_PASSWORD,
      port: this.config.env.POSTGRESQL_PORT,
      logging: false,
    });

    sequelize.addModels(models);
    await sequelize.sync({ alter: true });
    await sequelize.authenticate();
    for (const seed of seeds) {
      await seed(this.config);
    }

    console.log('Successfully connected to database');
  }

  private initMiddlewares() {
    this.server.use(SessionMiddleware);
    this.server.use(ViewsMiddleware);
    this.server.use(express.json());
    this.server.use(LogMiddleware);
    this.server.use(cors({ origin: '*' }));
  }

  private initErrorHandlers() {
    this.server.use(ErrorHandler);
  }

  private initControllers() {
    this.server.use('/user', this.userController.router);
    this.server.use('/task', this.taskController.router);
  }

  async init() {
    this.initMiddlewares();
    this.initControllers();

    await this.connectPostgres();

    setupSwagger(this.server);

    this.initErrorHandlers();
    this.start();

    logRoutes(this.server);
  }

  private start() {
    const port = this.config.env.PORT;

    this.server.listen(port, () => {
      console.log(`Server is started on port ${port}...`);
    });
  }
}
