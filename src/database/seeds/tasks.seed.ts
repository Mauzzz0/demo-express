import config from '../../config';
import { Environment } from '../../config/config.dto';
import { TaskModel, UserModel } from '../models';

export const tasksSeed = async () => {
  if (config.ENV === Environment.dev) {
    const admin = await UserModel.findOne({ where: { nick: config.ADMIN_NICK } });

    if (admin) {
      const task1: Partial<TaskModel> = { title: 'Задача-1', description: '', authorId: admin.id };
      const task2: Partial<TaskModel> = {
        title: 'Задача-2',
        description: '',
        authorId: admin.id,
        assigneeId: admin.id,
      };

      await TaskModel.bulkCreate([task1, task2]);
      console.log('Successfully seeded 2 tasks to default admin');
    }
  }
};
