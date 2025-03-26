import { Environment } from '../../config/config.dto';
import { ConfigService } from '../../config/config.service';
import logger from '../../logger/pino.logger';
import { TaskModel, UserModel } from '../models';

export const tasksSeed = async (config: ConfigService) => {
  if (config.env.env === Environment.dev) {
    const admin = await UserModel.findOne({ where: { nick: config.env.admin.nick } });

    if (admin) {
      const tasks: Partial<TaskModel>[] = [
        { title: 'Задача-1', description: 'Задача, созданная админом', authorId: admin.id },
        {
          title: 'Задача-2',
          description: 'Задача, созданная и назначенная на админа',
          authorId: admin.id,
          assigneeId: admin.id,
        },
      ];

      for (const task of tasks) {
        const exists = await TaskModel.findOne({ where: task });
        if (!exists) {
          await TaskModel.create(task);

          logger.info(`Successfully seeded '${task.title}' task to default admin`);
        }
      }
    }
  }
};
