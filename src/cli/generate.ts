import { validate } from '../validation/validate';
import { PositiveNumberSchema } from '../task/schemas';
import { taskRepository } from '../task/task.repository';
import { getRandomItems, upperFirst } from './utils';
import { words } from './mock.values';

const count = validate(process.argv[2], PositiveNumberSchema);

for (let i = 0; i < count; i++) {
  const title = getRandomItems(words, 3).join(' ');
  const description = getRandomItems(words, 10).join(' ');

  taskRepository.create({
    title: upperFirst(title),
    description: upperFirst(description),
  });
}
