import 'reflect-metadata';

type Options = {
  a: boolean;
  b: number;
  c: string;
  d: null[];
  e?: Record<string, any>;
};

function SetManyMetadata(options: Options) {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata('a', options.a, target);
    Reflect.defineMetadata('b', options.b, target);
    Reflect.defineMetadata('c', options.c, target);
    Reflect.defineMetadata('d', options.d, target);
    Reflect.defineMetadata('e', options.e, target);
  };
}

class ExampleClass {
  @SetManyMetadata({
    a: true,
    b: 101,
    c: 'example string',
    d: [null, null],
  })
  name: string;
}

export const main = () => {
  const instance = new ExampleClass();

  const metadataKeys = Reflect.getMetadataKeys(instance);
  for (const metadataKey of metadataKeys) {
    const value = Reflect.getMetadata(metadataKey, instance);
    console.log(`${metadataKey}=${JSON.stringify(value)}`);
  }
};

main();

/anna.*/;
new RegExp('anna.*');
