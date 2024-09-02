import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';

export const simpleReadable = () => {
  const stream = new Readable({
    read() {
      const close = Math.random() > 0.9;
      if (close) {
        return this.push(null);
      }

      return this.push('Фрагмент текста');
    },
  });

  stream.on('data', (data) => console.log(data.toString()));
  stream.on('end', () => console.log('Чтение завершено'));
};

export const readable = () => {
  const stream = createReadStream('file.txt', { highWaterMark: 50, encoding: 'utf-8' });

  stream.on('end', () => console.log('Чтение данных завершено!'));

  stream.on('data', (chunk) => {
    const text = chunk.toString();
    console.log(`Пришел фрагмент данных из ${text.length} символов: [${text}]`);
  });
};

export const readable2 = async () => {
  const stream = createReadStream('file.txt', { highWaterMark: 50, encoding: 'utf-8' });

  stream.on('end', () => console.log('Чтение данных завершено!'));

  for await (const chunk of stream) {
    const text = chunk.toString();
    console.log(`Пришел фрагмент данных из ${text.length} символов: [${text}]`);
  }
};
