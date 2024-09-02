import { createWriteStream } from 'node:fs';
import { Writable } from 'node:stream';

export const simpleWriteable = () => {
  const stream = new Writable({
    write(chunk: any, encoding, callback) {
      console.log(`Получен чанк: ${chunk.toString()}`);
      callback();
    },
  });

  stream.on('finish', () => console.log('Конец записи!'));

  stream.write('Фрагмент текста 1');
  stream.write('Фрагмент текста 2');
};

export const writeable = () => {
  const stream = createWriteStream('saved.txt');

  stream.on('finish', () => console.log('Запись завершена!'));

  const text = 'Просто пример сообщения, которое запишется в файл';
  const chunkLength = 10;

  const chunkCount = Math.ceil(text.length / chunkLength);
  console.log(`Размер сообщения: ${text.length}
Размер одного чанка: ${chunkLength}
Ожидаемое кол-во чанков: ${chunkCount}\n`);

  for (let i = 0; i < chunkCount; i++) {
    const start = chunkLength * i;
    const end = chunkLength * (i + 1);
    console.log(`Читаем чанк [${i + 1}/${chunkCount}]. Возьмутся символы от ${start} до ${end}`);

    const chunk = text.substring(start, end);
    console.log(`Будет отправлен фрагмент данных: [${chunk}]`);

    stream.write(Buffer.from(chunk, 'utf8'));

    console.log();
  }

  stream.close();
};
