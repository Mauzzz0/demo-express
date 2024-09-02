import { createReadStream, createWriteStream } from 'node:fs';
import { Readable, Transform, Writable } from 'node:stream';

export const simple_transform = () => {
  const readable = new Readable({
    read() {
      if (Math.random() > 0.9) {
        return this.push(null);
      }

      return this.push(`Фрагмент текста`);
    },
  });

  const writable = new Writable({
    write(chunk: any, encoding, callback) {
      console.log(`Получен чанк: ${chunk.toString()}`);
      callback();
    },
  });

  let i = 0;
  const transform = new Transform({
    transform(chunk, encoding, callback) {
      const text = chunk.toString();
      this.push(`${text} №${i++}`);
      callback();
    },
  });

  readable.pipe(transform).pipe(writable);
};

export const transform = async () => {
  const readStream = createReadStream('file.txt', { highWaterMark: 30, encoding: 'utf-8' });

  const writeStream = createWriteStream('saved.txt');

  const transform = new Transform({
    transform(chunk: any, encoding, callback) {
      const text = chunk.toString();
      this.push(text + '\n');
      callback();
    },
  });

  readStream.pipe(transform).pipe(writeStream);
};
