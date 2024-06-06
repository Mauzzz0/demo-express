import { TaskService } from './task.service';
import { TaskController } from './task.controller';

const service = new TaskService();
export const taskController = new TaskController(service);
