import { createReadStream, createWriteStream } from 'node:fs';
import { Readable, Writable } from 'node:stream';

export const read_pipe_write = () => {
  const readStream = createReadStream('file.txt', { highWaterMark: 50, encoding: 'utf-8' });

  const writeStream = createWriteStream('saved.txt');

  readStream.pipe(writeStream);
};

export const simple_read_pipe_write = () => {
  let i = 0;

  const readable = new Readable({
    read() {
      if (Math.random() > 0.9) {
        return this.push(null);
      }

      return this.push(`Фрагмент текста №${i++}`);
    },
  });

  readable.on('end', () => console.log('Конец чтения'));

  const writable = new Writable({
    write(chunk: any, encoding, callback) {
      console.log(`Получен чанк: ${chunk.toString()}`);
      callback();
    },
  });

  writable.on('finish', () => console.log('Конец записи'));

  readable.pipe(writable);
};
