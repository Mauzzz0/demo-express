import { TaskController } from './task.controller';
import { TaskService } from './task.service';

const service = new TaskService();
export const taskController = new TaskController(service);
