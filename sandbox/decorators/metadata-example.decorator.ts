import 'reflect-metadata';

const REQUIRED_METADATA_KEY = 'REQUIRED';
const MIN_LENGTH_METADATA_KEY = 'MIN_LENGTH_METADATA_KEY';

function Required() {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata(REQUIRED_METADATA_KEY, true, target);
  };
}

function MinLength(length: number) {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata(MIN_LENGTH_METADATA_KEY, length, target);
  };
}

class User {
  @Required()
  name: string;

  @Required()
  @MinLength(5)
  password: string;
}

const validateRequired = <T extends Record<string, any>>(instance: T, property: keyof T) => {
  const isRequired = Reflect.getMetadata(REQUIRED_METADATA_KEY, instance);

  // В метаданных написано поле обязательно, но фактически оно не задано (там лежит undefined) => кидаем ошибку
  if (isRequired && instance[property] === undefined) {
    throw Error(`Поле "${String(property)}" является обязательным`);
  }
};

const validateMinLength = <T extends Record<string, any>>(instance: T, property: keyof T) => {
  const minLength = Reflect.getMetadata(MIN_LENGTH_METADATA_KEY, instance);

  // В метаданных написана минимальная длина, но фактически она меньше => кидаем ошибку
  if (minLength && instance[property].length < minLength) {
    throw Error(`Значение в поле "${String(property)}" должно быть минимум длиной ${minLength}`);
  }
};

const main = () => {
  const user1 = new User();

  try {
    validateRequired(user1, 'name');
    validateMinLength(user1, 'password');
    console.log('user1: Успешно провалидирован');
  } catch (error: any) {
    console.log('user1: Ошибка валидации:', error.message);
  }

  const user2 = new User();
  user2.name = 'max';
  user2.password = 'pwd';

  try {
    validateRequired(user2, 'name');
    validateMinLength(user2, 'password');
    console.log('user2: Успешно провалидирован');
  } catch (error: any) {
    console.log('user2: Ошибка валидации:', error.message);
  }

  const user3 = new User();
  user3.name = 'jake';
  user3.password = 'admin';

  try {
    validateRequired(user3, 'name');
    validateMinLength(user3, 'password');
    console.log('user3: Успешно провалидирован');
  } catch (error: any) {
    console.log('user3: Ошибка валидации:', error.message);
  }
};

main();
