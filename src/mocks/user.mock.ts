import { faker } from '@faker-js/faker';

export type UserMock = {
  id: number;
  email: string;
  name: string;
};

export const userMock = (count?: number): UserMock | UserMock[] => {
  if (!count || count === 1) {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      email: faker.internet.email(),
      name: faker.person.fullName(),
    };
  }

  const users: UserMock[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.number.int({ min: 1, max: 1000 }),
      email: faker.internet.email(),
      name: faker.person.fullName(),
    });
  }

  return users;
};
