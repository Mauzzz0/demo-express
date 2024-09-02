import { createReadStream, createWriteStream } from 'node:fs';

export const copyFile = async () => {
  const readStream = createReadStream('file.txt', { encoding: 'utf-8' });

  readStream.on('end', () => console.log('Конец чтения!'));

  const writeStream = createWriteStream('saved.txt');

  writeStream.on('finish', () => console.log('Конец записи!'));

  readStream.pipe(writeStream);
};

export const logFunctionCall = async () => {
  console.log('Сейчас начнётся копирования!');
  await copyFile();
  console.log('Копирование файла завершено!');
};

logFunctionCall();
