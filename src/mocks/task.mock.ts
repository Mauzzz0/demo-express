import { faker } from '@faker-js/faker';

export type TaskMock = {
  id: number;
  title: string;
  description: string;
};

export const taskMock = (count?: number): TaskMock | TaskMock[] => {
  if (!count || count === 1) {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 1, max: 5 }),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
    };
  }

  const tasks: TaskMock[] = [];
  for (let i = 0; i < count; i++) {
    tasks.push({
      id: faker.number.int({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 1, max: 6 }),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
    });
  }

  return tasks;
};
