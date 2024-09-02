import { setTimeout } from 'node:timers/promises';

import dayjs from 'dayjs';

function Log() {
  return (target: Object, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const start = dayjs();

      const result = await originalMethod?.apply(this, args);

      const end = dayjs();

      console.log({
        class: target.constructor.name,
        method: methodName,
        start: start.toISOString(),
        end: end.toISOString(),
        durationMs: end.diff(start, 'ms'),
        result,
      });

      return result;
    };
  };
}

class ExampleClass {
  @Log()
  async getRandom() {
    await setTimeout(1000);

    return Math.round(Math.random() * 1000000);
  }
}

const main = async () => {
  const instance = new ExampleClass();

  const value1 = await instance.getRandom();
  console.log(`Результат 1: ${value1}`);

  console.log();

  const value2 = await instance.getRandom();
  console.log(`Результат 2: ${value2}`);
};

main();
