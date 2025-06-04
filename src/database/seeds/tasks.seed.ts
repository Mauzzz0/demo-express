import { appConfig } from '../../config';
import { Environment } from '../../config/app-config.dto';
import logger from '../../logger/pino.logger';
import { TaskEntity, UserEntity } from '../entities';

export const tasksSeed = async () => {
  if (appConfig.env === Environment.dev) {
    const admin = await UserEntity.findOne({ where: { email: appConfig.admin.email } });

    if (admin) {
      const tasks: Partial<TaskEntity>[] = [
        { title: 'Задача-1', description: 'Задача, созданная админом', authorId: admin.id },
        {
          title: 'Задача-2',
          description: 'Задача, созданная и назначенная на админа',
          authorId: admin.id,
          assigneeId: admin.id,
        },
      ];

      for (const task of tasks) {
        const exists = await TaskEntity.findOne({ where: task });
        if (!exists) {
          await TaskEntity.create(task);

          logger.info(`Successfully seeded '${task.title}' task to default admin`);
        }
      }
    }
  }
};
