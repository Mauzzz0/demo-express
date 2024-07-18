import { validate } from '../validation/validate';
import { taskRepository } from '../task/task.repository';
import { getRandomItems, upperFirst } from './utils';
import { words } from './mock.values';
import { GenerateCommandOptions } from './dto';

const params = {
  count: process.argv[2],
};
const { count } = validate(GenerateCommandOptions, params);

for (let i = 0; i < count; i++) {
  const title = getRandomItems(words, 3).join(' ');
  const description = getRandomItems(words, 10).join(' ');

  taskRepository.create({
    title: upperFirst(title),
    description: upperFirst(description),
  });
}
