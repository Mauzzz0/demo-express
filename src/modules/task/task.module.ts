import { Container } from 'inversify';
import { Components } from '../../shared/inversify.types';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

export const createTaskModule = () => {
  const container = new Container();

  container.bind(Components.TaskService).to(TaskService).inSingletonScope();
  container.bind(Components.TaskController).to(TaskController).inSingletonScope();

  return container;
};
