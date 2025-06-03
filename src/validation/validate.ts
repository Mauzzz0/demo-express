import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BadRequestException } from '../errors';

export const validate = <T extends object, V>(cls: ClassConstructor<T>, data: V): T => {
  const instance = plainToInstance<T, V>(cls, data);
  const errors = validateSync(instance);

  if (errors.length) {
    const [{ constraints }] = errors;

    if (constraints) {
      throw new BadRequestException(constraints[Object.keys(constraints)[0]]);
    }

    throw new BadRequestException('Unknown validation error');
  }

  return instance;
};
