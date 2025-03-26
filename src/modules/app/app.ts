import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Sequelize } from 'sequelize-typescript';
import { logRoutes } from '../../bootstrap/log-routes';
import { ConfigService } from '../../config/config.service';
import { models } from '../../database/models';
import { seeds } from '../../database/seeds';
import logger from '../../logger/pino.logger';
import { ErrorHandler, LogMiddleware, rateLimiter, SessionMiddleware, ViewsMiddleware } from '../../middlewares';
import { setupSwagger } from '../../swagger/setup-swagger';
import { TaskController } from '../task/task.controller';
import { UserController } from '../user/user.controller';

@injectable()
export class App {
  private readonly server: Express;

  constructor(
    @inject(ConfigService)
    private readonly config: ConfigService,
    @inject(UserController)
    private readonly userController: UserController,
    @inject(TaskController)
    private readonly taskController: TaskController,
  ) {
    this.server = express();
  }

  private async connectPostgres() {
    const sequelize = new Sequelize({
      ...this.config.env.postgres,
      dialect: 'postgres',
      logging: false,
    });

    sequelize.addModels(models);
    await sequelize.sync({ alter: true });
    await sequelize.authenticate();
    for (const seed of seeds) {
      await seed(this.config);
    }

    logger.info('Successfully connected to database');
  }

  private initMiddlewares() {
    this.server.use(rateLimiter);
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
    const port = this.config.env.port;

    this.server.listen(port, () => {
      logger.info(`Server is started on port ${port}...`);
    });
  }
}
