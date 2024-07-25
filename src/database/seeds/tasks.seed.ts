import dayjs from 'dayjs';

import { Environment } from '../../config/config.dto';
import { ConfigService } from '../../config/config.service';
import { TaskModel, TimeModel, UserModel } from '../models';

export const tasksSeed = async (config: ConfigService) => {
  if (config.env.ENV === Environment.dev) {
    const admin = await UserModel.findOne({ where: { nick: config.env.ADMIN_NICK } });

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
          const createdTask = await TaskModel.create(task);
          await TimeModel.create({
            taskId: createdTask.id,
            userId: admin.id,
            date: dayjs().toISOString(),
            time: '1 day',
          });

          console.log(`Successfully seeded '${task.title}' task to default admin`);
        }
      }
    }
  }
};
