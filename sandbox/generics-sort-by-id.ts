/**
 * Создайте дженерик-функцию "sortById", которая может сортировать массивы любых типов, у которых есть { id: number }.
 * Пользователь функции может выбирать направление сортировки - asc (по возрастанию) и desc (по убыванию).
 * По умолчанию используется по возрастанию.
 *
 * Если вы забыли про сортировку, то вспомните тему Массивы. map, find, filter, sort, reduce.
 */

import { fakerRU } from '@faker-js/faker';

const sortById = <T extends { id: number }>(items: T[], direction: 'asc' | 'desc' = 'asc') => {
  items.sort((a: T, b: T) => (direction === 'asc' ? a.id - b.id : b.id - a.id));
};

type User = {
  id: number;
  name: string;
};

type Animal = {
  id: number;
  name: string;
  type: string;
};

const randomUsers: User[] = Array.from({ length: 5 }).map(() => {
  return {
    id: fakerRU.number.int({ min: 1, max: 100 }),
    name: fakerRU.person.fullName(),
  };
});

const randomAnimals: Animal[] = Array.from({ length: 7 }).map(() => {
  return {
    id: fakerRU.number.int({ min: 1, max: 100 }),
    name: fakerRU.person.fullName(),
    type: fakerRU.animal.type(),
  };
});

const randomObjects = Array.from({ length: 4 }).map(() => {
  return {
    id: fakerRU.number.int({ min: 1, max: 100 }),
    company: fakerRU.company.name(),
    food: fakerRU.food.dish(),
  };
});

sortById(randomUsers);
console.log(randomUsers); // Должны быть отсортированы по возрастанию id

sortById(randomAnimals, 'desc');
console.log(randomAnimals); // Должны быть отсортированы по убыванию id

sortById(randomObjects, 'asc');
console.log(randomObjects); // Должны быть отсортированы по возрастанию id

/*
В примерах ниже должна гореть ошибка!
Для запуска закомментируйте эти строки
 */
sortById([{}]);
sortById([{ a: 10 }]);
sortById([{ id: 'asj' }]);
