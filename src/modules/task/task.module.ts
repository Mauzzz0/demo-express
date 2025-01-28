import { Container } from 'inversify';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

export const createTaskModule = () => {
  const container = new Container();

  container.bind(TaskService).toSelf().inSingletonScope();
  container.bind(TaskController).toSelf().inSingletonScope();

  return container;
};
